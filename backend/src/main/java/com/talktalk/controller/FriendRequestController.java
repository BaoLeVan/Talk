package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.FriendRequestResponse;
import com.talktalk.service.FriendRequestService;
import com.talktalk.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/friends/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendRequestController {

    FriendRequestService friendRequestService;
    UserService userService;

    @GetMapping("/received")
    public ApiResponse<List<FriendRequestResponse>> getReceivedRequests() {
        Long currentUserId = getCurrentUserId();
        log.info("Get received friend requests successfully: {}", currentUserId);
        return ApiResponse.<List<FriendRequestResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get received friend requests successfully")
                .data(friendRequestService.getReceivedRequests(currentUserId))
                .build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).getId();
    }

}
