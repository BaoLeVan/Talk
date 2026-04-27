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

    NOT_FOUND(404, "Not Found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(400, "Invalid request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(401, "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403, "Forbidden", HttpStatus.FORBIDDEN),
    INTERNAL_SERVER_ERROR(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    TOKEN_GENERATION_FAILED(500, "Token generation failed", HttpStatus.INTERNAL_SERVER_ERROR),

    // Permission
    PERMISSION_EXIST(400, "Permission already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(404, "Permission not found", HttpStatus.NOT_FOUND),

    // Role
    ROLE_EXIST(400, "Role already exists", HttpStatus.BAD_REQUEST),

    // User
    USER_EXIST(400, "User already exists", HttpStatus.BAD_REQUEST),
    EMAIL_EXIST(400, "Email already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(404, "User not found", HttpStatus.NOT_FOUND),
    USER_NOT_VERIFIED(400, "User not verified", HttpStatus.BAD_REQUEST),

    // Mail
    FAILED_TO_SEND_OTP(500, "Failed to send OTP", HttpStatus.INTERNAL_SERVER_ERROR);

    int code;
    String message;
    HttpStatus status;
}
