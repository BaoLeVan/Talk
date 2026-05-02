package com.talktalk.exception;

import org.springframework.http.HttpStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {

    NOT_FOUND(600, "Not Found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(601, "Invalid request", HttpStatus.BAD_REQUEST),

    // Token
    UNAUTHORIZED(700, "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(701, "Forbidden", HttpStatus.FORBIDDEN),
    INTERNAL_SERVER_ERROR(702, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    TOKEN_GENERATION_FAILED(703, "Token generation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(704, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    
    // Permission
    PERMISSION_EXIST(800, "Permission already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(801, "Permission not found", HttpStatus.NOT_FOUND),

    // Role
    ROLE_EXIST(900, "Role already exists", HttpStatus.BAD_REQUEST),

    // User
    USER_EXIST(1000, "User already exists", HttpStatus.BAD_REQUEST),
    EMAIL_EXIST(1001, "Email already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    USER_NOT_VERIFIED(1003, "User not verified", HttpStatus.BAD_REQUEST),
    USER_ALREADY_VERIFIED(1004, "User already verified", HttpStatus.BAD_REQUEST),
    PASSWORD_WRONG(1005, "Password is wrong", HttpStatus.BAD_REQUEST),

    // Mail
    FAILED_TO_SEND_OTP(1100, "Failed to send OTP", HttpStatus.INTERNAL_SERVER_ERROR);

    int code;
    String message;
    HttpStatus status;
}
