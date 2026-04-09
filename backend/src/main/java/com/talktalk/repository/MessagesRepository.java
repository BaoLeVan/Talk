package com.talktalk.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.Message;

@Repository
public interface MessagesRepository extends MongoRepository<Message, String> {
}
