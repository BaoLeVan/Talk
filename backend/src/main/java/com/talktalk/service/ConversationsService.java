package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.response.ConversationResponse;

public interface ConversationsService {
    List<ConversationResponse> getAllConversation(Long userId, String title);
}
