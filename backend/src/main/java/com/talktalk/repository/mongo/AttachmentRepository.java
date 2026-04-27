package com.talktalk.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.Attachment;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {

}
