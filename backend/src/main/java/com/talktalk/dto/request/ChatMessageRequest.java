package com.talktalk.dto.request;

import java.util.List;

import com.talktalk.model.document.Attachment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequest {
    private Long senderId;
    private Long conversationId;
    private String content;
    private String messageType;
    private List<Attachment> attachments;
}
