package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.UserResponse;
import com.talktalk.service.UserService;
import com.talktalk.utils.Utils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

    UserService userService;
    Utils utils;

    @GetMapping
    public ApiResponse<UserResponse> getCurrentUser() {
        UserResponse user = utils.getCurrentUser();
        if (user != null) {
            user.setIsOnline(userService.checkOnline(user.getId()));
        }
        log.info("User: {}", user);
        return ApiResponse.<UserResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get user successfully")
                .data(user)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsers(@RequestParam String keyword) {
        UserResponse currentUser = utils.getCurrentUser();
        List<UserResponse> users = userService.searchUsers(keyword, currentUser.getId());
        return ApiResponse.<List<UserResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Search users successfully")
                .data(users)
                .build();
    }
}
