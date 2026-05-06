package com.talktalk.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;
import com.talktalk.model.entity.Conversations;

@Repository
public interface ConversationsRepository extends JpaRepository<Conversations, Long> {

    @Query("SELECT new com.talktalk.dto.response.ConversationResponse(c.id, c.avatar, c.title, c.type, c.lastMessage, c.lastMessageAt, cm2.user.id, u.userName, u.avatar) " +
            "FROM ConversationsMembers cm " +
            "JOIN cm.conversations c " +
            "JOIN ConversationsMembers cm2 ON cm2.conversations.id = c.id " +
            "JOIN cm2.user u " +
            "WHERE cm.user.id = :userId " +
            "AND (c.title LIKE CONCAT('%', :title, '%') OR (c.type = 0 AND u.userName LIKE CONCAT('%', :title, '%') AND u.id <> :userId)) " +
            "AND c.deletedAt IS NULL AND cm.leftAt IS NULL " +
            "ORDER BY c.lastMessageAt DESC")
    List<ConversationResponse> getAllConversation(@Param("userId") Long userId, @Param("title") String title);

    @Query("SELECT new com.talktalk.dto.response.MembersResponse(u.id, u.avatar, u.userName, cm.role) " +
            "FROM ConversationsMembers cm " +
            "JOIN cm.conversations c " +
            "JOIN cm.user u " +
            "WHERE cm.conversations.id = :conversationId " +
            "AND c.deletedAt IS NULL AND cm.leftAt IS NULL AND c.type = 1")
    List<MembersResponse> getListMemberByConversationId(@Param("conversationId") Long conversationId);


    Optional<Conversations> findByIdAndDeletedAtIsNull(Long id);
}
