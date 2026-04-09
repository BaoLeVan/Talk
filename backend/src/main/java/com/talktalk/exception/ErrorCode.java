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

    NOT_FOUND(404, "Not Found", HttpStatus.NOT_FOUND);

    int code;
    String message;
    HttpStatus status;
}
