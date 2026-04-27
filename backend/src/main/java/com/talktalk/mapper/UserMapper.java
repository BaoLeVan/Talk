package com.talktalk.mapper;

import org.mapstruct.Mapper;

import com.talktalk.dto.request.RegisterRequest;
import com.talktalk.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUserRegister(RegisterRequest request);
}
