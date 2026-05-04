package com.talktalk.service.impl;

import org.springframework.stereotype.Service;

import com.talktalk.dto.response.RoleUserInConversation;
import com.talktalk.repository.jpa.ConversationsMembersRepository;
import com.talktalk.service.ConversationsMemberService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationsMemberServiceImpl implements ConversationsMemberService {

    ConversationsMembersRepository conversationsMembersRepository;

    @Override
    public void removeMemberInGroup(Long conversationId, Long userDeleteId) {
        conversationsMembersRepository.removeMemberInGroup(conversationId, userDeleteId);
    }

    @Override
    public RoleUserInConversation getRoleUserInConversation(Long conversationId, Long userId) {
        return conversationsMembersRepository.getRoleUserInConversation(conversationId, userId);
    }
}
