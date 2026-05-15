package com.talktalk.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.talktalk.dto.response.RoleUserInConversation;
import com.talktalk.model.entity.ConversationsMembers;

import jakarta.transaction.Transactional;

@Repository
public interface ConversationsMembersRepository extends JpaRepository<ConversationsMembers, Long> {

        @Query("SELECT cm FROM ConversationsMembers cm " +
                        "JOIN FETCH cm.conversations c " +
                        "WHERE cm.user.id = :userId AND cm.leftAt IS NULL AND c.deletedAt IS NULL " +
                        "ORDER BY c.lastMessageAt DESC")
        List<ConversationsMembers> findAllByUserId(@Param("userId") Long userId);

        @Modifying
        @Transactional
        @Query("UPDATE ConversationsMembers cm SET cm.leftAt = CURRENT_TIMESTAMP WHERE cm.conversations.id = :conversationId AND cm.user.id = :userDeleteId")
        void removeMemberInGroup(@Param("conversationId") Long conversationId,
                        @Param("userDeleteId") Long userDeleteId);

        @Query("SELECT new com.talktalk.dto.response.RoleUserInConversation(cm.user.id, cm.user.userName, cm.role) FROM ConversationsMembers cm "
                        +
                        "WHERE cm.conversations.id = :conversationId AND cm.user.id = :userId AND cm.leftAt IS NULL AND cm.conversations.deletedAt IS NULL")
        RoleUserInConversation getRoleUserInConversation(@Param("conversationId") Long conversationId,
                        @Param("userId") Long userId);

        boolean existsByConversationsIdAndUserIdAndLeftAtIsNull(Long conversationId, Long userId);

        boolean existsByConversationsIdAndUserIdAndLeftAtNotNull(Long conversationId, Long userId);

        @Modifying
        @Transactional
        @Query("UPDATE ConversationsMembers cm SET cm.leftAt = NULL, cm.joinedAt = CURRENT_TIMESTAMP WHERE cm.conversations.id = :conversationId AND cm.user.id = :userAddId")
        void updateMemberJoinedAtInGroup(@Param("conversationId") Long conversationId,
                        @Param("userAddId") Long userAddId);

        @Modifying
        @Transactional
        @Query("UPDATE ConversationsMembers cm SET cm.lastReadMessageId = :lastReadMessageId, cm.unreadCount = 0 WHERE cm.conversations.id = :conversationId AND cm.user.id = :userId")
        void updateLastReadMessageIdAndCountUnread(@Param("conversationId") Long conversationId,
                        @Param("userId") Long userId, @Param("lastReadMessageId") String lastReadMessageId);

        @Query("SELECT cm.user.id FROM ConversationsMembers cm WHERE cm.conversations.id = :conversationId")
        List<Long> findUserIdsByConversationId(@Param("conversationId") Long conversationId);

        @Modifying
        @Transactional
        @Query("UPDATE ConversationsMembers cm SET cm.unreadCount = cm.unreadCount + 1 WHERE cm.conversations.id = :conversationId AND cm.user.id IN :userIds")
        void incrementUnreadCount(@Param("conversationId") Long conversationId, @Param("userIds") List<Long> userIds);
}
