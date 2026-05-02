package com.talktalk.service.impl;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.mapper.ConversationMapper;
import com.talktalk.model.entity.Conversations;
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
    ConversationMapper conversationMapper;

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<ConversationResponse> getAllConversation(Long userId, String title) {
        List<Conversations> conversations = conversationsRepository.getAllConversation(userId, title);
        return conversations.stream()
                .map(conversationMapper::toConversationResponse)
                .toList();
    }

}
