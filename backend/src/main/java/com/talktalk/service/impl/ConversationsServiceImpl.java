package com.talktalk.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;
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


    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<ConversationResponse> getAllConversation(Long userId, String title) {
        List<ConversationResponse> conversations = conversationsRepository.getAllConversation(userId, title);
        Map<Long, ConversationResponse> conversationMap = new LinkedHashMap<>();
        conversations.forEach(conversation -> conversationMap.put(conversation.getConversationId(), conversation));
        return new ArrayList<>(conversationMap.values());
    }

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<MembersResponse> getListMemberByConversationId(Long conversationId) {
        return conversationsRepository.getListMemberByConversationId(conversationId);
    }

}
