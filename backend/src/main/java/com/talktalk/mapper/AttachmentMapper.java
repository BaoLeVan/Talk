package com.talktalk.mapper;

import org.mapstruct.Mapper;

import com.talktalk.dto.response.AttachmentResponse;
import com.talktalk.model.document.Attachment;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {
    AttachmentResponse toAttachmentResponse(Attachment attachment);
}
