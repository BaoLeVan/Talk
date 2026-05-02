package com.talktalk.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.talktalk.model.entity.Conversations;

@Repository
public interface ConversationsRepository extends JpaRepository<Conversations, Long> {

    @Query("SELECT cm.conversations FROM Conversations_members cm " +
            "WHERE cm.user.id = :userId AND cm.leftAt IS NULL AND cm.conversations.deletedAt IS NULL " +
            "AND cm.conversations.title LIKE %:title% " +
            "ORDER BY cm.conversations.lastMessageAt DESC LIMIT 15")
    List<Conversations> getAllConversation(@Param("userId") Long userId, @Param("title") String title);
}
