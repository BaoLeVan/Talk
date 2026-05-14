package com.talktalk.dto.response;

import java.time.LocalDateTime;

import com.talktalk.exception.enums.TypeConversation;

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
public class ConversationResponse {
    Long conversationId;
    String conversationAvatar;
    String conversationTitle;
    TypeConversation conversationType;
    String conversationLastMessage;
    LocalDateTime conversationLastMessageAt;
    String conversationLastReadMessageId;
    Long countMessageUnread;

    Long userId;
    String userName;
    String userAvatar;

    public ConversationResponse(Long conversationId, String conversationAvatar, String conversationTitle,
            TypeConversation conversationType, String conversationLastMessage, LocalDateTime conversationLastMessageAt,
            String conversationLastReadMessageId, Long userId, String userName, String userAvatar) {
        this.conversationId = conversationId;
        this.conversationAvatar = conversationAvatar;
        this.conversationTitle = conversationTitle;
        this.conversationType = conversationType;
        this.conversationLastMessage = conversationLastMessage;
        this.conversationLastMessageAt = conversationLastMessageAt;
        this.conversationLastReadMessageId = conversationLastReadMessageId;
        this.userId = userId;
        this.userName = userName;
        this.userAvatar = userAvatar;
    }
}
