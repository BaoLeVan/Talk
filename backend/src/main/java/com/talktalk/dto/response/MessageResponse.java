package com.talktalk.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.talktalk.exception.enums.MessageAction;
import com.talktalk.exception.enums.MessageStatus;
import com.talktalk.exception.enums.MessageType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
    String idMessage;
    Long conversationId;
    UserResponse user;
    String content;
    MessageStatus status;
    MessageType messageType;
    MessageAction action;
    LocalDateTime editedAt;
    LocalDateTime deletedAt;
    List<AttachmentResponse> attachments;
    List<MessageReactionResponse> reactions;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
