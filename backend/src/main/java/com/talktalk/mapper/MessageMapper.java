package com.talktalk.mapper;

import org.mapstruct.Mapper;

import com.talktalk.dto.response.MessageResponse;
import com.talktalk.model.document.Message;

@Mapper(componentModel = "spring", uses = AttachmentMapper.class)
public interface MessageMapper {
    MessageResponse toMessageResponse(Message message);
}
