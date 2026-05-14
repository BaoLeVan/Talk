package com.talktalk.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;
import com.talktalk.model.document.Message;
import com.talktalk.repository.jpa.ConversationsRepository;
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

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")

    public List<ConversationResponse> getAllConversation(Long userId, String title) {
        List<ConversationResponse> conversations = conversationsRepository.getAllConversation(userId, title);
        Map<Long, ConversationResponse> conversationMap = new LinkedHashMap<>();
        conversations.forEach(conversation -> conversationMap.put(conversation.getConversationId(), conversation));
        List<ConversationResponse> response = new ArrayList<>(conversationMap.values());

        response.forEach(conversation -> {
            conversation.setCountMessageUnread(getUnreadCount(
            conversation.getConversationId(),
            conversation.getConversationLastReadMessageId()));
        });
        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<MembersResponse> getListMemberByConversationId(Long conversationId) {
        return conversationsRepository.getListMemberByConversationId(conversationId);
    }

    public Long getUnreadCount(Long conversationId, String lastReadId) {
       if(lastReadId == null) {
        return mongoTemplate.count(new Query(Criteria.where("conversationId").is(conversationId)), Message.class);
       }
        Query query = new Query(Criteria.where("conversationId").is(conversationId)
                .and("_id").gt(new ObjectId(lastReadId)));

        return mongoTemplate.count(query, Message.class);
    }
}
