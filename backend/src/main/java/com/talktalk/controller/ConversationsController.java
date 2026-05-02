package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.service.ConversationsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/conversations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ConversationsController {

    ConversationsService conversationsService;

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ConversationResponse>> getAllConversation(@PathVariable Long userId,
            @RequestParam(defaultValue = "") String title) {
        log.info("Get all conversations by user id: {}", userId);
        List<ConversationResponse> conversations = conversationsService.getAllConversation(userId, title);
        return ApiResponse.<List<ConversationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get conversations successfully")
                .data(conversations)
                .build();
    }
}
