package com.talktalk.mapper;

import org.mapstruct.Mapper;

import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.dto.response.UserResponse;
import com.talktalk.model.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUserRegister(RegisterRequest request);

    UserResponse toUserResponse(User user);
}
