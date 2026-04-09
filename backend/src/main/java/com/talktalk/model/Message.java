package com.talktalk.model;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import com.talktalk.exception.enums.MessageStatus;
import com.talktalk.exception.enums.MessageType;

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
    MessageType type;
    MessageStatus status;
    LocalDateTime deletedAt;
}
