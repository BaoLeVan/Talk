package com.talktalk.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.document.Attachment;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {

}
