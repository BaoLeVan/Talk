package com.talktalk.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.request.CreateGroupConversationRequest;
import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;
import com.talktalk.dto.response.RoleUserInConversation;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.MemberRole;
import com.talktalk.exception.enums.TypeConversation;
import com.talktalk.model.document.Message;
import com.talktalk.model.entity.Conversations;
import com.talktalk.model.entity.ConversationsMembers;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.ConversationsMembersRepository;
import com.talktalk.repository.jpa.ConversationsRepository;
import com.talktalk.repository.jpa.UserRepository;
import com.talktalk.service.ConversationsService;
import com.talktalk.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationsServiceImpl implements ConversationsService {

    ConversationsRepository conversationsRepository;
    ConversationsMembersRepository conversationsMembersRepository;
    MongoTemplate mongoTemplate;
    UserRepository userRepository;
    UserService userService;

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<ConversationResponse> getAllConversation(Long userId, String title) {
        Pageable pageable = PageRequest.of(0, 20);
        List<ConversationResponse> conversations = conversationsRepository.getAllConversation(userId, title, pageable);
        Map<Long, ConversationResponse> conversationMap = new LinkedHashMap<>();
        conversations.forEach(conversation -> conversationMap.put(conversation.getConversationId(), conversation));
        List<ConversationResponse> response = new ArrayList<>(conversationMap.values());
        return setUserForConversation(response);
    }

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<MembersResponse> getListMemberByConversationId(Long conversationId) {
        return conversationsRepository.getListMemberByConversationId(conversationId);
    }

    @Override
    public ConversationResponse createGroupConversation(Long currentUserId, CreateGroupConversationRequest request) {
        if (request == null || request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        List<Long> requestedMemberIds = request.getMemberIds() == null ? List.of() : request.getMemberIds().stream()
                .filter(Objects::nonNull)
                .filter(id -> !id.equals(currentUserId))
                .distinct()
                .toList();

        if (requestedMemberIds.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        List<User> members = userRepository.findAllById(requestedMemberIds);
        if (members.size() != requestedMemberIds.size()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Conversations conversation = Conversations.builder()
                .title(request.getTitle().trim())
                .type(TypeConversation.GROUP)
                .avatar(null)
                .lastMessage(null)
                .lastSenderId(null)
                .lastMessageAt(LocalDateTime.now())
                .deletedAt(null)
                .build();
        conversation = conversationsRepository.save(conversation);
        final Conversations savedConversation = conversation;

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        conversationsMembersRepository.save(ConversationsMembers.builder()
                .conversations(savedConversation)
                .user(currentUser)
                .role(MemberRole.ADMIN)
                .unreadCount(0L)
                .lastReadMessageId(null)
                .joinedAt(LocalDateTime.now())
                .leftAt(null)
                .build());

        List<ConversationsMembers> membersToSave = members.stream()
                .map(member -> ConversationsMembers.builder()
                        .conversations(savedConversation)
                        .user(member)
                        .role(MemberRole.MEMBER)
                        .unreadCount(0L)
                        .lastReadMessageId(null)
                        .joinedAt(LocalDateTime.now())
                        .leftAt(null)
                        .build())
                .toList();
        conversationsMembersRepository.saveAll(membersToSave);

        return ConversationResponse.builder()
                .conversationId(savedConversation.getId())
                .conversationAvatar(savedConversation.getAvatar())
                .conversationTitle(savedConversation.getTitle())
                .conversationType(savedConversation.getType())
                .conversationLastSenderId(savedConversation.getLastSenderId())
                .conversationLastMessage(savedConversation.getLastMessage())
                .conversationLastMessageAt(savedConversation.getLastMessageAt())
                .conversationLastReadMessageId(null)
                .conversationUnreadCount(0L)
                .userId(currentUser.getId())
                .userName(currentUser.getUserName())
                .userAvatar(currentUser.getAvatar())
                .userIsOnline(userService.checkOnline(currentUser.getId()))
                .build();
    }

    @Override
    public void deleteGroupConversation(Long currentUserId, Long conversationId) {
        RoleUserInConversation roleUserInConversation = conversationsMembersRepository.getRoleUserInConversation(conversationId, currentUserId);

        if (roleUserInConversation == null || roleUserInConversation.getRole() != MemberRole.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        int updatedRows = conversationsRepository.markDeletedGroupConversation(conversationId, LocalDateTime.now());
        if (updatedRows == 0) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
    }

    public Long getUnreadCount(Long conversationId, String lastReadId) {
        if (lastReadId == null) {
            return mongoTemplate.count(new Query(Criteria.where("conversationId").is(conversationId)), Message.class);
        }
        Query query = new Query(Criteria.where("conversationId").is(conversationId)
                .and("_id").gt(new ObjectId(lastReadId)));

        return mongoTemplate.count(query, Message.class);
    }

    public List<ConversationResponse> setUserForConversation(List<ConversationResponse> conversations) {
        Set<Long> senderIds = conversations.stream()
                .map(ConversationResponse::getConversationLastSenderId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Long, User> userMap = userRepository.findAllById(senderIds)
                .stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        conversations.forEach(conversation -> {
            Long senderId = conversation.getConversationLastSenderId();
            if (senderId != null) {
                User user = userMap.get(senderId);
                if (user != null) {
                    conversation.setUserIsOnline(userService.checkOnline(senderId));
                    conversation.setConversationLastSenderName(user.getUserName());
                }
            }
        });
        return conversations;
    }
}
