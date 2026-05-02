package com.talktalk.controller;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Date;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.talktalk.dto.request.LoginRequest;
import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.request.ResendOtpRequest;
import com.talktalk.dto.request.VerifyOtpRequest;
import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.AuthenticationResponse;
import com.talktalk.dto.response.RegisterResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @PostMapping("/resend-otp")
    public ApiResponse<Void> resendOtp(@RequestBody ResendOtpRequest request) {
        log.info("Resend OTP request: {}", request);
        authService.resendOtp(request.getEmail());
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Resend OTP Success")
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody LoginRequest request,
            HttpServletResponse httpServletResponse) {
        log.info("Login request: {}", request);
        AuthenticationResponse response = authService.login(request);

        setTokenCookies(response, httpServletResponse);

        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Login Success")
                .data(AuthenticationResponse.builder()
                        .accessToken(response.getAccessToken())
                        .user(response.getUser())
                        .build())
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refresh(HttpServletRequest httpRequest,
            HttpServletResponse httpServletResponse) throws JOSEException, ParseException {
        log.info("Refresh token request");

        Cookie[] cookies = httpRequest.getCookies();
        if (cookies == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String refreshToken = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("refreshToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        AuthenticationResponse response = authService.refreshToken(refreshToken);

        setTokenCookies(response, httpServletResponse);

        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Refresh Token Success")
                .data(AuthenticationResponse.builder()
                        .accessToken(response.getAccessToken())
                        .user(response.getUser())
                        .build())
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse httpServletResponse) {
        log.info("Logout request");

        // Clear refresh token cookie
        ResponseCookie clearCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Logout Success")
                .build();
    }

    private void setTokenCookies(AuthenticationResponse response, HttpServletResponse httpServletResponse) {
        ResponseCookie refreshTokenCookie = buildTokenCookie("refreshToken", response.getRefreshToken());

        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    private ResponseCookie buildTokenCookie(String cookieName, String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(resolveMaxAgeSeconds(token))
                .build();
    }

    private long resolveMaxAgeSeconds(String token) {
        try {
            Date expirationTime = SignedJWT.parse(token).getJWTClaimsSet().getExpirationTime();
            if (expirationTime == null) {
                return -1;
            }

            long remainingSeconds = (expirationTime.getTime() - System.currentTimeMillis()) / 1000;
            return Math.max(remainingSeconds, 0);
        } catch (ParseException e) {
            log.warn("Cannot parse token expiration. Fallback to session cookie.");
            return -1;
        }
    }

}
