package com.talktalk.mapper;

import org.mapstruct.Mapper;

import com.talktalk.dto.request.PermissionRequest;
import com.talktalk.dto.response.PermissionResponse;
import com.talktalk.model.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toPermission(PermissionRequest permissionRequest);

    PermissionResponse toPermissionResponse(Permission permission);
}
