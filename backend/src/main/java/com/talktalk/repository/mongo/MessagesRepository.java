package com.talktalk.repository.mongo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.document.Message;

@Repository
public interface MessagesRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);

    List<Message> findByConversationIdAndCreatedAtBeforeOrderByCreatedAtDesc(
            Long conversationId,
            LocalDateTime createdAt,
            Pageable pageable);

    List<Message> findByConversationIdAndAttachmentsIsNotNullAndDeletedAtIsNullOrderByCreatedAtDesc(
            Long conversationId,
            Pageable pageable);

    List<Message> findByConversationIdAndAttachmentsIsNotNullAndDeletedAtIsNullAndCreatedAtBeforeOrderByCreatedAtDesc(
            Long conversationId,
            LocalDateTime createdAt,
            Pageable pageable);
}
