package com.talktalk.model.document;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import org.springframework.data.mongodb.core.mapping.Document;

import com.talktalk.exception.enums.MessageStatus;
import com.talktalk.model.entity.BaseEntity;

@Document(collection = "messages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message extends BaseEntity {
    String conversationId;
    String senderId;
    String content;
    MessageStatus status;
    LocalDateTime deletedAt;
    List<Attachment> attachments;
}
