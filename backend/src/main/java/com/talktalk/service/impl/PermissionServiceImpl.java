package com.talktalk.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.talktalk.dto.request.PermissionRequest;
import com.talktalk.dto.response.PermissionResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.mapper.PermissionMapper;
import com.talktalk.model.Permission;
import com.talktalk.repository.PermissionRepository;
import com.talktalk.service.PermissionService;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl implements PermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @Override
    @Transactional
    public PermissionResponse createPermission(PermissionRequest permissionRequest) {
        if (Objects.isNull(permissionRequest)) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        if (permissionRepository.existsById(permissionRequest.getPermissionName())) {
            throw new AppException(ErrorCode.PERMISSION_EXIST);
        }

        Permission permission = permissionMapper.toPermission(permissionRequest);
        return permissionMapper
                .toPermissionResponse(permissionRepository.save(permission));
    }

    @Override
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .collect(Collectors.toList());
    }

}
