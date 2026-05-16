package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.request.CreateGroupConversationRequest;
import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.dto.response.MembersResponse;
import com.talktalk.service.ConversationsService;
import com.talktalk.service.UserService;

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
    UserService userService;

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

    @PostMapping("/groups")
    public ApiResponse<ConversationResponse> createGroupConversation(@RequestBody CreateGroupConversationRequest request) {
        Long currentUserId = getCurrentUserId();
        ConversationResponse conversation = conversationsService.createGroupConversation(currentUserId, request);
        return ApiResponse.<ConversationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Create group conversation successfully")
                .data(conversation)
                .build();
    }

    @DeleteMapping("/groups/{conversationId}")
    public ApiResponse<Void> deleteGroupConversation(@PathVariable Long conversationId) {
        Long currentUserId = getCurrentUserId();
        conversationsService.deleteGroupConversation(currentUserId, conversationId);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Delete group conversation successfully")
                .build();
    }

    @GetMapping("/members")
    public ApiResponse<List<MembersResponse>> getListMemberByConversationId(@RequestParam Long conversationId) {
        log.info("Get list member by conversation id: {}", conversationId);
        List<MembersResponse> members = conversationsService.getListMemberByConversationId(conversationId);
        return ApiResponse.<List<MembersResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get list member successfully")
                .data(members)
                .build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).getId();
    }
}
