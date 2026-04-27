package com.talktalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.Conversations;

@Repository
public interface ConversationsRepository extends JpaRepository<Conversations, Long> {
}
