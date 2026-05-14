package com.talktalk.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.talktalk.dto.response.MessageResponse;
import com.talktalk.model.document.Message;
import com.talktalk.model.entity.User;

@Mapper(componentModel = "spring", uses = {
        AttachmentMapper.class,
        UserMapper.class
})
public interface MessageMapper {

    @Mapping(target = "user", source = "user")
    @Mapping(target = "createdAt", source = "message.createdAt")
    @Mapping(target = "updatedAt", source = "message.updatedAt")
    @Mapping(target = "deletedAt", source = "message.deletedAt")
    @Mapping(target = "idMessage", source = "message.id")
    MessageResponse toMessageResponse(Message message, User user);
}
