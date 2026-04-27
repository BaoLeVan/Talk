package com.talktalk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talktalk.dto.request.RoleRequest;
import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.RoleResponse;
import com.talktalk.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {

    RoleService roleService;

    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest roleRequest) {
        log.info("Creating role: {}", roleRequest);
        RoleResponse roleResponse = roleService.createRole(roleRequest);
        return ApiResponse.<RoleResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Create role successfully")
                .data(roleResponse)
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        log.info("Getting all roles");
        List<RoleResponse> roleResponses = roleService.getAllRoles();
        return ApiResponse.<List<RoleResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get all roles successfully")
                .data(roleResponses)
                .build();
    }
}
