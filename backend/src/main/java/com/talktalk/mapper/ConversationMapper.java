package com.talktalk.mapper;

import org.mapstruct.Mapper;

import com.talktalk.dto.response.ConversationResponse;
import com.talktalk.model.entity.Conversations;

@Mapper(componentModel = "spring")
public interface ConversationMapper {

    ConversationResponse toConversationResponse(Conversations conversations);
}
