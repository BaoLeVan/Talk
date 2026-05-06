package com.talktalk.dto.common;

import java.util.List;

import com.talktalk.exception.enums.MessageAction;
import com.talktalk.exception.enums.MessageType;
import com.talktalk.model.document.Attachment;

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
public class CreateMessageCommand {
    Long conversationId;
    Long senderId;

    String content;

    MessageType messageType;
    MessageAction action;

    Long targetUserId;
    String targetUserName;

    List<Attachment> attachments;
}
