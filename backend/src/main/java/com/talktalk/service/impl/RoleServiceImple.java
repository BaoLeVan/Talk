package com.talktalk.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.talktalk.dto.request.RoleRequest;
import com.talktalk.dto.response.RoleResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.mapper.RoleMapper;
import com.talktalk.model.Permission;
import com.talktalk.model.Role;
import com.talktalk.repository.PermissionRepository;
import com.talktalk.repository.RoleRepository;
import com.talktalk.service.RoleService;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImple implements RoleService {

    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    @Override
    @Transactional
    public RoleResponse createRole(RoleRequest roleRequest) {
        if (roleRequest == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        if (roleRepository.existsById(roleRequest.getRoleName())) {
            throw new AppException(ErrorCode.ROLE_EXIST);
        }

        Role role = roleMapper.toRole(roleRequest);
        Set<Permission> permissions = roleRequest.getPermissions().stream()
                .map(permissionName -> permissionRepository.findById(permissionName)
                        .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND)))
                .collect(Collectors.toSet());
        role.setPermissions(permissions);
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .collect(Collectors.toList());
    }

}
