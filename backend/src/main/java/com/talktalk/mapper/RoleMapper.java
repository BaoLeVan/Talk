package com.talktalk.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.talktalk.dto.request.RoleRequest;
import com.talktalk.dto.response.RoleResponse;
import com.talktalk.model.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);
}
