package com.talktalk.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.common.CreateMessageCommand;
import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.request.DeleteMessageRequest;
import com.talktalk.dto.request.HandleSocketRequest;
import com.talktalk.dto.request.ReactionRequest;
import com.talktalk.dto.response.MediaAttachmentPageResponse;
import com.talktalk.dto.response.MediaAttachmentResponse;
import com.talktalk.dto.response.MessageDeleteResponse;
import com.talktalk.dto.response.MessagePageResponse;
import com.talktalk.dto.response.MessageResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.MessageAction;
import com.talktalk.exception.enums.MessageStatus;
import com.talktalk.exception.enums.MessageType;
import com.talktalk.mapper.MessageMapper;
import com.talktalk.model.document.Attachment;
import com.talktalk.model.document.Message;
import com.talktalk.model.document.MessageHiddenUser;
import com.talktalk.model.document.MessageReaction;
import com.talktalk.model.entity.Conversations;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.ConversationsMembersRepository;
import com.talktalk.repository.jpa.ConversationsRepository;
import com.talktalk.repository.jpa.UserRepository;
import com.talktalk.repository.mongo.AttachmentRepository;
import com.talktalk.repository.mongo.MessageHiddenUserRepository;
import com.talktalk.repository.mongo.MessagesRepository;
import com.talktalk.service.MessagesService;
import com.talktalk.service.redis.service.StatusUserInConvRedisService;
import com.talktalk.utils.Utils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesServiceImpl implements MessagesService {

        MessagesRepository messagesRepository;
        MessageMapper messageMapper;
        UserRepository userRepository;
        ConversationsRepository conversationsRepository;
        ConversationsMembersRepository conversationsMembersRepository;
        AttachmentRepository attachmentRepository;
        StatusUserInConvRedisService statusUserInConvRedisService;
        MongoTemplate mongoTemplate;
        MessageHiddenUserRepository messageHiddenUserRepository;
        Utils utils;

        @Override
        public MessageResponse createMessage(ChatMessageRequest request) {
                CreateMessageCommand cmd = new CreateMessageCommand();
                cmd.setConversationId(request.getConversationId());
                cmd.setSenderId(request.getSenderId());
                cmd.setContent(request.getContent());
                cmd.setMessageType(MessageType.CHAT);
                cmd.setAttachments(request.getAttachments());

                Message saved = createMessageCommon(cmd);

                User user = userRepository.findById(request.getSenderId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                handleUnreadCountForUser(saved.getConversationId(), saved.getSenderId());

                return messageMapper.toMessageResponse(saved, user);
        }

        @Override
        public MessageResponse createRemoveMemberMessage(HandleSocketRequest request) {
                User user = userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                CreateMessageCommand cmd = new CreateMessageCommand();
                cmd.setConversationId(request.getConversationId());
                cmd.setSenderId(request.getUserId());
                cmd.setMessageType(MessageType.SYSTEM);
                cmd.setAction(MessageAction.REMOVE_MEMBER);
                cmd.setTargetUserId(request.getUserTargetIds().get(0));
                cmd.setTargetUserName(request.getUserTargetNames().get(0));
                cmd.setContent(request.getUserTargetNames().get(0) + " has been removed by " + user.getUserName());

                Message saved = createMessageCommon(cmd);

                return messageMapper.toMessageResponse(saved, user);
        }

        @Override
        public MessageResponse createLeaveMessage(HandleSocketRequest request) {
                User user = userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                CreateMessageCommand cmd = new CreateMessageCommand();
                cmd.setConversationId(request.getConversationId());
                cmd.setSenderId(request.getUserId());
                cmd.setMessageType(MessageType.SYSTEM);
                cmd.setAction(MessageAction.LEAVE);
                cmd.setContent(user.getUserName() + " has left the group");

                Message saved = createMessageCommon(cmd);

                return messageMapper.toMessageResponse(saved, user);
        }

        @Override
        public MessageResponse createAddMemberMessage(HandleSocketRequest request) {
                User user = userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                CreateMessageCommand cmd = new CreateMessageCommand();
                cmd.setConversationId(request.getConversationId());
                cmd.setSenderId(request.getUserId());
                cmd.setMessageType(MessageType.SYSTEM);
                cmd.setAction(MessageAction.ADD_MEMBER);
                cmd.setContent(user.getUserName() + " has added " + String.join(", ", request.getUserTargetNames())
                                + " to the group");

                Message saved = createMessageCommon(cmd);

                return messageMapper.toMessageResponse(saved, user);
        }

        public Message createMessageCommon(CreateMessageCommand cmd) {
                Conversations conversation = conversationsRepository
                                .findByIdAndDeletedAtIsNull(cmd.getConversationId())
                                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

                boolean isMember = conversationsMembersRepository
                                .existsByConversationsIdAndUserIdAndLeftAtIsNull(
                                                cmd.getConversationId(),
                                                cmd.getSenderId());

                if (!isMember) {
                        throw new AppException(ErrorCode.FORBIDDEN);
                }

                List<Attachment> attachments = Collections.emptyList();

                if (cmd.getAttachments() != null && !cmd.getAttachments().isEmpty()) {
                        attachments = attachmentRepository.saveAll(cmd.getAttachments());
                }

                LocalDateTime now = LocalDateTime.now();

                Message message = Message.builder()
                                .conversationId(cmd.getConversationId())
                                .senderId(cmd.getSenderId())
                                .content(cmd.getContent())
                                .messageType(cmd.getMessageType())
                                .action(cmd.getAction())
                                .attachments(attachments)
                                .status(MessageStatus.SENT)
                                .deletedAt(null)
                                .build();

                message.setCreatedAt(now);
                message.setUpdatedAt(now);

                Message saved = messagesRepository.save(message);

                conversation.setLastSenderId(cmd.getSenderId());
                conversation.setLastMessage(cmd.getContent());
                conversation.setLastMessageAt(now);
                conversationsRepository.save(conversation);

                return saved;
        }

        public void handleUnreadCountForUser(Long conversationsId, Long senderId) {
                List<Long> memberIds = conversationsMembersRepository.findUserIdsByConversationId(conversationsId);
                Set<Long> activeMemberIds = statusUserInConvRedisService.getMemberUserInConv(conversationsId);
                List<Long> membersToIncrement = memberIds.stream()
                                .filter(id -> !activeMemberIds.contains(id) && !id.equals(senderId))
                                .collect(Collectors.toList());
                conversationsMembersRepository.incrementUnreadCount(conversationsId, membersToIncrement);
        }

        @Override
        @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
        public MediaAttachmentPageResponse getImageAttachmentsByConversationId(Long conversationId, LocalDateTime cursor, int size) {
                int validSize = size <= 0 ? 20 : Math.min(size, 50);

                Pageable pageable = PageRequest.of(0, validSize);

                List<Message> messages;

                if (cursor == null) {
                        messages = messagesRepository
                                        .findByConversationIdAndAttachmentsIsNotNullAndDeletedAtIsNullOrderByCreatedAtDesc(
                                                        conversationId,
                                                        pageable);
                } else {
                        messages = messagesRepository
                                        .findByConversationIdAndAttachmentsIsNotNullAndDeletedAtIsNullAndCreatedAtBeforeOrderByCreatedAtDesc(
                                                        conversationId,
                                                        cursor,
                                                        pageable);
                }

                List<MediaAttachmentResponse> items = messages.stream()
                                .flatMap(message -> {
                                        if (message.getAttachments() == null || message.getAttachments().isEmpty()) {
                                                return Stream.<MediaAttachmentResponse>empty();
                                        }

                                        return message.getAttachments().stream()
                                                        .filter(attachment -> attachment.getContentType() != null
                                                                        && attachment.getContentType().toLowerCase().startsWith("image/"))
                                                        .map(attachment -> MediaAttachmentResponse.builder()
                                                                        .messageId(message.getId())
                                                                        .url(attachment.getUrl())
                                                                        .fileName(attachment.getFileName())
                                                                        .contentType(attachment.getContentType())
                                                                        .size(attachment.getSize())
                                                                        .createdAt(attachment.getCreatedAt() != null
                                                                                        ? attachment.getCreatedAt()
                                                                                        : message.getCreatedAt())
                                                                        .build());
                                })
                                .limit(validSize)
                                .collect(Collectors.toList());

                LocalDateTime nextCursor = messages.isEmpty()
                                ? null
                                : messages.get(messages.size() - 1).getCreatedAt();

                return MediaAttachmentPageResponse.builder()
                                .items(items)
                                .nextCursor(nextCursor)
                                .hasNext(messages.size() == validSize)
                                .build();
        }

        @Override
        @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
        public MessagePageResponse getMessagesByConversationId(Long conversationId, LocalDateTime cursor, int size) {
                Long currentUserId = utils.getCurrentUser().getId();
                int validSize = size <= 0 ? 25 : Math.min(size, 50);
                int querySize = Math.max(validSize * 3, validSize);

                Pageable pageable = PageRequest.of(0, querySize);

                List<Message> queriedMessages;

                if (cursor == null) {
                        queriedMessages = messagesRepository
                                        .findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
                } else {
                        queriedMessages = messagesRepository
                                        .findByConversationIdAndCreatedAtBeforeOrderByCreatedAtDesc(
                                                        conversationId,
                                                        cursor,
                                                        pageable);
                }

                List<Message> visibleMessages = filterVisibleMessagesForUser(queriedMessages, currentUserId, validSize);
                Collections.reverse(visibleMessages);

                Set<Long> senderIds = visibleMessages.stream()
                                .map(Message::getSenderId)
                                .collect(Collectors.toSet());

                Set<Long> reactionUserIds = visibleMessages.stream()
                                .filter(m -> m.getReactions() != null)
                                .flatMap(m -> m.getReactions().stream())
                                .map(MessageReaction::getUserId)
                                .collect(Collectors.toSet());

                Set<Long> allUserIds = new HashSet<>(senderIds);
                allUserIds.addAll(reactionUserIds);

                Map<Long, User> userMap = userRepository.findAllById(allUserIds)
                                .stream()
                                .collect(Collectors.toMap(User::getId, u -> u));

                List<MessageResponse> response = visibleMessages.stream()
                                .map(message -> messageMapper.toMessageResponse(
                                                message,
                                                userMap.get(message.getSenderId()),
                                                userMap))
                                .collect(Collectors.toList());

                LocalDateTime nextCursor = queriedMessages.isEmpty()
                                ? null
                                : queriedMessages.get(queriedMessages.size() - 1).getCreatedAt();

                return MessagePageResponse.builder()
                                .messages(response)
                                .nextCursor(nextCursor)
                                .hasNext(queriedMessages.size() == querySize)
                                .build();
        }

        private List<Message> filterVisibleMessagesForUser(List<Message> messages, Long currentUserId, int limit) {
                if (messages == null || messages.isEmpty()) {
                        return Collections.emptyList();
                }

                List<Message> notDeletedMessages = messages.stream()
                                .filter(message -> message.getDeletedAt() == null)
                                .collect(Collectors.toList());

                if (notDeletedMessages.isEmpty()) {
                        return Collections.emptyList();
                }

                List<String> messageIds = notDeletedMessages.stream()
                                .map(Message::getId)
                                .collect(Collectors.toList());

                Set<String> hiddenMessageIds = messageHiddenUserRepository
                                .findByUserIdAndMessageIdIn(String.valueOf(currentUserId), messageIds)
                                .stream()
                                .map(MessageHiddenUser::getMessageId)
                                .collect(Collectors.toSet());

                return notDeletedMessages.stream()
                                .filter(message -> !hiddenMessageIds.contains(message.getId()))
                                .limit(limit)
                                .collect(Collectors.toList());
        }

        @Override
        public void markRead(Long conversationId, String lastReadMessageId, Long userId) {
                statusUserInConvRedisService.setMemberInConv(conversationId, userId);
                statusUserInConvRedisService.setUserActiveInConv(userId, conversationId);
                conversationsMembersRepository.updateLastReadMessageIdAndCountUnread(conversationId, userId,
                                lastReadMessageId);
        }

        @Override
        public MessageResponse editMessage(ChatMessageRequest request) {
                Query query = Query.query(
                                Criteria.where("_id").is(new ObjectId(request.getIdMessage())));
                Update update = Update.update("content", request.getContent())
                                .set("updatedAt", LocalDateTime.now())
                                .set("status", MessageStatus.EDITED);

                Message message = mongoTemplate.findAndModify(query, update,
                                FindAndModifyOptions.options().returnNew(true), Message.class);
                if (message == null) {
                        throw new AppException(ErrorCode.MESSAGE_NOT_FOUND);
                }
                User user = userRepository.findById(request.getSenderId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                return messageMapper.toMessageResponse(message, user);
        }

        @Override
        public MessageResponse reactToMessage(ReactionRequest request) {
                Message message = messagesRepository.findById(request.getMessageId())
                                .orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

                List<MessageReaction> reactions = message.getReactions() == null
                                ? new ArrayList<>()
                                : new ArrayList<>(message.getReactions());

                boolean removed = reactions.removeIf(r -> r.getUserId().equals(request.getUserId())
                                && r.getIcon().equals(request.getIcon()));

                if (!removed) {
                        reactions.removeIf(r -> r.getUserId().equals(request.getUserId()));
                        reactions.add(MessageReaction.builder()
                                        .userId(request.getUserId())
                                        .icon(request.getIcon())
                                        .build());
                }

                message.setReactions(reactions);
                Message saved = messagesRepository.save(message);
                saved.setStatus(MessageStatus.REACTED);

                Set<Long> allUserIds = new HashSet<>();
                if (saved.getSenderId() != null) allUserIds.add(saved.getSenderId());
                if (saved.getReactions() != null) {
                        saved.getReactions().forEach(r -> allUserIds.add(r.getUserId()));
                }

                Map<Long, User> userMap = userRepository.findAllById(allUserIds)
                                .stream()
                                .collect(Collectors.toMap(User::getId, u -> u));

                User sender = userMap.get(saved.getSenderId());
                return messageMapper.toMessageResponse(saved, sender, userMap);
        }

        @Override
        public MessageDeleteResponse deleteMessage(DeleteMessageRequest request, Long userId) {
                Message message = messagesRepository.findById(request.getMessageId())
                                .orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

                boolean isMember = conversationsMembersRepository
                                .existsByConversationsIdAndUserIdAndLeftAtIsNull(request.getConversationId(), userId);
                if (!isMember) {
                        throw new AppException(ErrorCode.FORBIDDEN);
                }

                LocalDateTime now = LocalDateTime.now();
                String deleteType = request.getDeleteType() == null ? "SELF" : request.getDeleteType().trim().toUpperCase();

                if ("EVERYONE".equals(deleteType)) {
                        if (!userId.equals(message.getSenderId())) {
                                throw new AppException(ErrorCode.FORBIDDEN);
                        }

                        if (message.getDeletedAt() == null) {
                                message.setDeletedAt(now);
                                message.setUpdatedAt(now);
                                messagesRepository.save(message);
                        } else {
                                now = message.getDeletedAt();
                        }

                        return MessageDeleteResponse.builder()
                                        .messageId(message.getId())
                                        .conversationId(message.getConversationId())
                                        .userId(userId)
                                        .deleteType("EVERYONE")
                                        .deletedAt(now)
                                        .build();
                }

                if (!messageHiddenUserRepository.existsByMessageIdAndUserId(message.getId(), String.valueOf(userId))) {
                        messageHiddenUserRepository.save(MessageHiddenUser.builder()
                                        .messageId(message.getId())
                                        .userId(String.valueOf(userId))
                                        .hiddenAt(now)
                                        .build());
                }

                return MessageDeleteResponse.builder()
                                .messageId(message.getId())
                                .conversationId(message.getConversationId())
                                .userId(userId)
                                .deleteType("SELF")
                                .deletedAt(now)
                                .build();
        }
}
