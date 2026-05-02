package com.talktalk.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.MessagePageResponse;
import com.talktalk.service.MessagesService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MessagesController {

    MessagesService messagesService;

    @GetMapping
    public ApiResponse<MessagePageResponse> getMessagesByConversationId(
            @RequestParam String conversationId,
            @RequestParam LocalDateTime cursor,
            @RequestParam(defaultValue = "25") int size) {
        log.info("Get messages by conversation id: {}, cursor: {}, size: {}", conversationId, cursor, size);
        MessagePageResponse response = messagesService.getMessagesByConversationId(conversationId, cursor, size);
        return ApiResponse.<MessagePageResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get messages successfully")
                .data(response)
                .build();
    }
}
