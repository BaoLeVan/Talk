package com.talktalk.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.talktalk.dto.response.RoleUserInConversation;
import com.talktalk.exception.enums.MemberRole;
import com.talktalk.model.entity.Conversations;
import com.talktalk.model.entity.ConversationsMembers;
import com.talktalk.model.entity.User;
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
    public void leaveGroup(Long conversationId, Long userId) {
        conversationsMembersRepository.removeMemberInGroup(conversationId, userId);
    }

    @Override
    public RoleUserInConversation getRoleUserInConversation(Long conversationId, Long userId) {
        return conversationsMembersRepository.getRoleUserInConversation(conversationId, userId);
    }

    @Override
    public void addMemberInGroup(Long conversationId, List<Long> userAddIds) {

        for (Long userAddId : userAddIds) {
            boolean isActiveMember = conversationsMembersRepository
                    .existsByConversationsIdAndUserIdAndLeftAtIsNull(conversationId, userAddId);
            if (isActiveMember) {
                continue;
            }

            boolean hasLeftMember = conversationsMembersRepository
                    .existsByConversationsIdAndUserIdAndLeftAtNotNull(conversationId, userAddId);
            if (hasLeftMember) {
                conversationsMembersRepository.updateMemberJoinedAtInGroup(conversationId, userAddId);
                continue;
            }

            ConversationsMembers conversationsMember = ConversationsMembers.builder()
                    .conversations(Conversations.builder().id(conversationId).build())
                    .user(User.builder().id(userAddId).build())
                    .role(MemberRole.MEMBER)
                    .joinedAt(LocalDateTime.now())
                    .build();
            conversationsMembersRepository.save(conversationsMember);
        }
    }
}
