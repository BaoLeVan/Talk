package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.request.RoleRequest;
import com.talktalk.dto.response.RoleResponse;

public interface RoleService {
    RoleResponse createRole(RoleRequest roleRequest);
    List<RoleResponse> getAllRoles();
} 
