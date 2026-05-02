package com.talktalk.service;

import com.talktalk.dto.request.LoginRequest;
import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.response.AuthenticationResponse;
import com.talktalk.dto.response.RegisterResponse;

import java.text.ParseException;
import com.nimbusds.jose.JOSEException;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);
    void verifyOtp(String email, String otp);
    void resendOtp(String email);
    AuthenticationResponse login(LoginRequest request);
    AuthenticationResponse refreshToken(String refreshToken) throws JOSEException, ParseException;
}
