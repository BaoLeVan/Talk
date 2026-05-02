package com.talktalk.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.talktalk.exception.enums.MessageStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String conversationId;
    private String senderId;
    private String content;
    private MessageStatus status;
    private LocalDateTime editedAt;
    private LocalDateTime deletedAt;
    private List<AttachmentResponse> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
