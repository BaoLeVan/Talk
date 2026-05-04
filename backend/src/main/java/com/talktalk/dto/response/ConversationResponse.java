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

    Long userId;
    String userName;
    String userAvatar;
}
