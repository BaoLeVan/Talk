package com.talktalk.service;

import com.talktalk.dto.request.LoginRequest;
import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.response.LoginResponse;
import com.talktalk.dto.response.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);
    void verifyOtp(String email, String otp);
    LoginResponse login(LoginRequest request);
}
