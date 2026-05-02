package com.talktalk.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.talktalk.model.entity.Conversations_members;

@Repository
public interface ConversationsMembersRepository extends JpaRepository<Conversations_members, Long> {

    @Query("SELECT cm FROM Conversations_members cm " +
            "JOIN FETCH cm.conversations c " +
            "WHERE cm.user.id = :userId AND cm.leftAt IS NULL AND c.deletedAt IS NULL " +
            "ORDER BY c.lastMessageAt DESC")
    List<Conversations_members> findAllByUserId(@Param("userId") Long userId);
}
