package com.talktalk.service;

import com.talktalk.dto.response.RoleUserInConversation;

public interface ConversationsMemberService {
    void removeMemberInGroup(Long conversationId, Long userDeleteId);
    RoleUserInConversation getRoleUserInConversation(Long conversationId, Long userId);
}
