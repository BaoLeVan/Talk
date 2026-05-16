package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.request.CreateGroupConversationRequest;
import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;

public interface ConversationsService {
    List<ConversationResponse> getAllConversation(Long userId, String title);

    List<MembersResponse> getListMemberByConversationId(Long conversationId);

    ConversationResponse createGroupConversation(Long currentUserId, CreateGroupConversationRequest request);
}
