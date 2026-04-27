package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.request.PermissionRequest;
import com.talktalk.dto.response.PermissionResponse;

public interface PermissionService {
    PermissionResponse createPermission(PermissionRequest permissionRequest);

    List<PermissionResponse> getAllPermissions();
}
