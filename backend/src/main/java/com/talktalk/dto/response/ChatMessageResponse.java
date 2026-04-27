package com.talktalk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {
    private String id;
    private String senderId;
    private String roomId;
    private String content;
    private String messageType; // e.g., CHAT, JOIN, LEAVE
    private LocalDateTime timestamp;
}
