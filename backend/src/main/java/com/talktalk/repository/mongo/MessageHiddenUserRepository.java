package com.talktalk.repository.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.document.MessageHiddenUser;

@Repository
public interface MessageHiddenUserRepository extends MongoRepository<MessageHiddenUser, String> {

    boolean existsByMessageIdAndUserId(String messageId, String userId);

    List<MessageHiddenUser> findByUserIdAndMessageIdIn(String userId, List<String> messageIds);
}
