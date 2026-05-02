package com.talktalk.repository.mongo;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

import com.talktalk.model.document.Message;

@Repository
public interface MessagesRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);

    long countByConversationId(String conversationId);

    List<Message> findByConversationIdAndCreatedAtBeforeOrderByCreatedAtDesc(
            String conversationId,
            LocalDateTime createdAt,
            Pageable pageable);
}
