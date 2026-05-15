package com.talktalk.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;
import com.talktalk.model.document.Message;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.ConversationsRepository;
import com.talktalk.repository.jpa.UserRepository;
import com.talktalk.service.ConversationsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationsServiceImpl implements ConversationsService {

    ConversationsRepository conversationsRepository;
    MongoTemplate mongoTemplate;
    UserRepository userRepository;

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<ConversationResponse> getAllConversation(Long userId, String title) {
        Pageable pageable = PageRequest.of(0, 20);
        List<ConversationResponse> conversations = conversationsRepository.getAllConversation(userId, title, pageable);
        Map<Long, ConversationResponse> conversationMap = new LinkedHashMap<>();
        conversations.forEach(conversation -> conversationMap.put(conversation.getConversationId(), conversation));
        List<ConversationResponse> response = new ArrayList<>(conversationMap.values());
        response = setUserForConversation(response);
        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<MembersResponse> getListMemberByConversationId(Long conversationId) {
        return conversationsRepository.getListMemberByConversationId(conversationId);
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
                    conversation.setConversationLastSenderName(user.getUserName());
                }
            }
        });
        return conversations;
    }
}
