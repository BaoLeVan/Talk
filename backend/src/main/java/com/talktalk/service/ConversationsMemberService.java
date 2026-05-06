package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.response.RoleUserInConversation;

public interface ConversationsMemberService {
    void removeMemberInGroup(Long conversationId, Long userDeleteId);

    void leaveGroup(Long conversationId, Long userId);

    RoleUserInConversation getRoleUserInConversation(Long conversationId, Long userId);

    void addMemberInGroup(Long conversationId, List<Long> userAddIds);
}
