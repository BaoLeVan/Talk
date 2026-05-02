package com.talktalk.service.impl;

import java.time.Instant;
import java.util.UUID;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.StringJoiner;
import java.text.ParseException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.talktalk.config.JwtProperties;
import com.talktalk.dto.request.LoginRequest;
import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.response.AuthenticationResponse;
import com.talktalk.dto.response.RegisterResponse;
import com.talktalk.dto.response.UserResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.RoleEnum;
import com.talktalk.mapper.UserMapper;
import com.talktalk.model.entity.Role;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.UserRepository;
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

    JwtProperties jwtProperties;

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
    public AuthenticationResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_WRONG);
        }

        if (!user.getIsVerified()) {
            throw new AppException(ErrorCode.USER_NOT_VERIFIED);
        }

        String accessToken = generateToken(user, false);
        String refreshToken = generateToken(user, true);

        UserResponse userResponse = userMapper.toUserResponse(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }

    private String generateToken(User user, boolean isRefresh) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);

        Date expirationTime;
        if (isRefresh) {
            expirationTime = new Date(Instant.now().plus(jwtProperties.getRefreshableDuration()).toEpochMilli());
        } else {
            expirationTime = new Date(Instant.now().plus(jwtProperties.getValidDuration()).toEpochMilli());
        }

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(new Date())
                .expirationTime(expirationTime)
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("tokenType", isRefresh ? "REFRESH" : "ACCESS")
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        try {
            jwsObject.sign(new MACSigner(jwtProperties.getSecret().getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            log.error("Error generating token", e);
            throw new AppException(ErrorCode.TOKEN_GENERATION_FAILED);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> {
                        stringJoiner.add(permission.getPermissionName());
                    });
                }
            });
        }
        return stringJoiner.toString();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        MACVerifier jwtVerifier = new MACVerifier(jwtProperties.getSecret().getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date now = new Date();

        Date expirationTime;
        if (isRefresh) {
            expirationTime = new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant()
                    .plus(jwtProperties.getRefreshableDuration()).toEpochMilli());
        } else {
            expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        }

        var verified = signedJWT.verify(jwtVerifier);

        if (!verified || expirationTime.before(now)) {
            log.warn("Token verification failed: verified={}, expired={}",
                    verified, expirationTime.before(now));
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
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

    @Override
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getIsVerified()) {
            throw new AppException(ErrorCode.USER_ALREADY_VERIFIED);
        }

        String otp = otpRedisService.generateOtp();
        otpRedisService.setOtp(email, otp);

        try {
            senderService.sendOtp(email, otp);
        } catch (MessagingException e) {
            log.error("Failed to resend OTP to {}: {}", email, e.getMessage());
            throw new AppException(ErrorCode.FAILED_TO_SEND_OTP);
        }
    }

    public AuthenticationResponse refreshToken(String refreshToken) throws JOSEException, ParseException {
        // Verify refresh token
        SignedJWT signedJWT = verifyToken(refreshToken, true);

        // Get user from token
        String email = signedJWT.getJWTClaimsSet().getSubject();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // Generate new access token and refresh token
        String newAccessToken = generateToken(user, false);
        String newRefreshToken = generateToken(user, true);
        UserResponse userResponse = userMapper.toUserResponse(user);

        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(userResponse)
                .build();
    }

}
