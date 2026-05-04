package com.talktalk.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.response.MessagePageResponse;
import com.talktalk.dto.response.MessageResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.MessageStatus;
import com.talktalk.mapper.MessageMapper;
import com.talktalk.model.document.Message;
import com.talktalk.model.entity.Conversations;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.ConversationsMembersRepository;
import com.talktalk.repository.jpa.ConversationsRepository;
import com.talktalk.repository.jpa.UserRepository;
import com.talktalk.repository.mongo.MessagesRepository;
import com.talktalk.service.MessagesService;

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

        @Override
        public MessageResponse createMessage(ChatMessageRequest request) {
                User user = userRepository.findById(request.getSenderId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                Conversations conversation = conversationsRepository
                                .findByIdAndDeletedAtIsNull(request.getConversationId())
                                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

                boolean isMember = conversationsMembersRepository
                                .existsByConversationsIdAndUserIdAndLeftAtIsNull(request.getConversationId(),
                                                request.getSenderId());
                if (!isMember) {
                        throw new AppException(ErrorCode.FORBIDDEN);
                }

                LocalDateTime now = LocalDateTime.now();
                Message message = Message.builder()
                                .conversationId(request.getConversationId())
                                .senderId(request.getSenderId())
                                .content(request.getContent())
                                .status(MessageStatus.SENT)
                                .attachments(Collections.emptyList())
                                .deletedAt(null)
                                .build();

                message.setUpdatedAt(now);
                message.setCreatedAt(now);
                Message savedMessage = messagesRepository.save(message);
                conversation.setLastMessage(request.getContent());
                conversation.setLastMessageAt(now);

                conversationsRepository.save(conversation);

                return messageMapper.toMessageResponse(savedMessage, user);
        }

        @Override
        @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
        public MessagePageResponse getMessagesByConversationId(Long conversationId, LocalDateTime cursor, int size) {
                int validSize = size <= 0 ? 25 : Math.min(size, 50);

                Pageable pageable = PageRequest.of(0, validSize);

                List<Message> messages;

                if (cursor == null) {
                        // Lần đầu mở chat
                        messages = messagesRepository
                                        .findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
                } else {
                        // Scroll lên → lấy tin cũ hơn
                        messages = messagesRepository
                                        .findByConversationIdAndCreatedAtBeforeOrderByCreatedAtDesc(
                                                        conversationId,
                                                        cursor,
                                                        pageable);
                }

                Collections.reverse(messages);

                Set<Long> userIds = messages.stream()
                                .map(Message::getSenderId)
                                .collect(Collectors.toSet());
                Map<Long, User> userMap = userRepository.findAllById(userIds)
                                .stream()
                                .collect(Collectors.toMap(User::getId, user -> user));

                // get user in messages
                List<MessageResponse> response = messages.stream()
                                .map(message -> messageMapper.toMessageResponse(message,
                                                userMap.get(message.getSenderId())))
                                .toList();

                // cursor mới = tin nhắn cũ nhất trong batch
                LocalDateTime nextCursor = messages.isEmpty()
                                ? null
                                : messages.get(0).getCreatedAt();

                return MessagePageResponse.builder()
                                .messages(response)
                                .nextCursor(nextCursor)
                                .hasNext(messages.size() == validSize)
                                .build();
        }
}
