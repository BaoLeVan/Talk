package com.talktalk.service;

import java.time.LocalDateTime;

import com.talktalk.dto.response.MessagePageResponse;

public interface MessagesService {
    MessagePageResponse getMessagesByConversationId(String conversationId, LocalDateTime cursor, int size);
}
