package com.talktalk.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.request.LoginRequest;
import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.request.VerifyOtpRequest;
import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.LoginResponse;
import com.talktalk.dto.response.RegisterResponse;
import com.talktalk.service.AuthService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthController {

    AuthService authService;

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterRequest request) {
        log.info("Register request: {}", request);
        RegisterResponse response = authService.register(request);

        return ApiResponse.<RegisterResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Register Success")
                .data(response)
                .build();
    }

    @PostMapping("/verify-otp")
    public ApiResponse<Void> verifyOtp(@RequestBody VerifyOtpRequest request) {
        log.info("Verify OTP request: {}", request);
        authService.verifyOtp(request.getEmail(), request.getOtp());
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Verify OTP Success")
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("Login request: {}", request);
        LoginResponse response = authService.login(request);
        return ApiResponse.<LoginResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Login Success")
                .data(response)
                .build();
    }

}
