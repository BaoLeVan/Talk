package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.FriendResponse;
import com.talktalk.service.FriendService;
import com.talktalk.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendController {

    FriendService friendService;
    UserService userService;

    @GetMapping
    public ApiResponse<List<FriendResponse>> getFriends() {
        Long currentUserId = getCurrentUserId();
        log.info("Get friends successfully: {}", currentUserId);
        return ApiResponse.<List<FriendResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get friends successfully")
                .data(friendService.getFriends(currentUserId))
                .build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).getId();
    }
}
