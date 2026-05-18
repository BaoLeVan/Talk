package com.talktalk.service;

import java.time.LocalDateTime;

import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.request.HandleSocketRequest;
import com.talktalk.dto.request.ReactionRequest;
import com.talktalk.dto.response.MediaAttachmentPageResponse;
import com.talktalk.dto.response.MessagePageResponse;
import com.talktalk.dto.response.MessageResponse;

public interface MessagesService {
    MessagePageResponse getMessagesByConversationId(Long conversationId, LocalDateTime cursor, int size);

    MediaAttachmentPageResponse getImageAttachmentsByConversationId(Long conversationId, LocalDateTime cursor, int size);

    MessageResponse createMessage(ChatMessageRequest request);

    MessageResponse editMessage(ChatMessageRequest request);

    MessageResponse createRemoveMemberMessage(HandleSocketRequest request);

    MessageResponse createLeaveMessage(HandleSocketRequest request);

    MessageResponse createAddMemberMessage(HandleSocketRequest request);

    void markRead(Long conversationId, String lastReadMessageId, Long userId);

    MessageResponse reactToMessage(ReactionRequest request);
}
