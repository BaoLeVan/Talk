package com.talktalk.service;

import java.time.LocalDateTime;

import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.response.MessagePageResponse;
import com.talktalk.dto.response.MessageResponse;

public interface MessagesService {
    MessagePageResponse getMessagesByConversationId(Long conversationId, LocalDateTime cursor, int size);

    MessageResponse createMessage(ChatMessageRequest request);
}
