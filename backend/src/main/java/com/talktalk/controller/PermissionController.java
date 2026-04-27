package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.request.PermissionRequest;
import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.PermissionResponse;
import com.talktalk.service.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionController {

    PermissionService permissionService;

    @PostMapping
    public ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest permissionRequest) {
        log.info("Creating permission: {}", permissionRequest);
        PermissionResponse permissionResponse = permissionService.createPermission(permissionRequest);
        return ApiResponse.<PermissionResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Create permission successfully")
                .data(permissionResponse)
                .build();
    }

    @GetMapping
    public ApiResponse<List<PermissionResponse>> getAllPermissions() {
        log.info("Getting all permissions");
        List<PermissionResponse> permissionResponses = permissionService.getAllPermissions();
        return ApiResponse.<List<PermissionResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get all permissions successfully")
                .data(permissionResponses)
                .build();
    }
}
