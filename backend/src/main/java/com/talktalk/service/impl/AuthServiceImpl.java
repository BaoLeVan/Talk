package com.talktalk.service.impl;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.talktalk.dto.request.LoginRequest;
import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.response.LoginResponse;
import com.talktalk.dto.response.RegisterResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.RoleEnum;
import com.talktalk.mapper.UserMapper;
import com.talktalk.model.Role;
import com.talktalk.model.User;
import com.talktalk.repository.UserRepository;
import com.talktalk.service.AuthService;
import com.talktalk.service.SenderService;
import com.talktalk.service.UserService;
import com.talktalk.service.redis.OtpRedisService;

import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthServiceImpl implements AuthService {

    PasswordEncoder passwordEncoder;
    OtpRedisService otpRedisService;
    UserService userService;
    UserMapper userMapper;
    SenderService senderService;
    UserRepository userRepository;

    @Value("${jwt.secret}")
    String secretKey;

    @Value("${jwt.validDuration}")
    String validDuration;

    @Value("${jwt.refreshableDuration}")
    String refreshableDuration;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        userService.checkExistEmail(request.getEmail());

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(encodedPassword);

        User user = userMapper.toUserRegister(request);
        Set<Role> role = new HashSet<>();
        role.add(Role.builder().roleName(RoleEnum.USER.name()).build());
        user.setRoles(role);
        userService.saveUser(user);

        String otp = otpRedisService.generateOtp();
        otpRedisService.setOtp(request.getEmail(), otp);

        try {
            senderService.sendOtp(request.getEmail(), otp);
        } catch (MessagingException e) {
            log.error("Failed to send OTP to {}: {}", request.getEmail(), e.getMessage());
            throw new AppException(ErrorCode.FAILED_TO_SEND_OTP);
        }

        return RegisterResponse.builder()
                .email(request.getEmail())
                .codeAccess(otp)
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        if (!user.getIsVerified()) {
            throw new AppException(ErrorCode.USER_NOT_VERIFIED);
        }

    }

    private String generateToken(User user, boolean isRefresh) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);

        Date expirationTime;
        if (isRefresh) {
            expirationTime = new Date(Instant.now().plus(Duration.parse(refreshableDuration)).toEpochMilli());
        } else {
            expirationTime = new Date(Instant.now().plus(Duration.parse(validDuration)).toEpochMilli());
        }

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(new Date())
                .expirationTime(expirationTime)
                .claim("scope", "user")
                .claim("tokenType", isRefresh ? "REFRESH" : "ACCESS")
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            log.error("Error generating token", e);
            throw new AppException(ErrorCode.TOKEN_GENERATION_FAILED);
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {
        String storedOtp = otpRedisService.getOtp(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        otpRedisService.deleteOtp(email);
        userService.updateVerified(email);
    }

}
