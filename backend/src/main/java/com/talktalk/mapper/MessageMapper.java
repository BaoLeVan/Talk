package com.talktalk.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.talktalk.dto.response.MessageReactionResponse;
import com.talktalk.dto.response.MessageResponse;
import com.talktalk.model.document.Message;
import com.talktalk.model.document.MessageReaction;
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
    @Mapping(target = "reactions", expression = "java(mapReactions(message.getReactions(), userMap))")
    MessageResponse toMessageResponse(Message message, User user, Map<Long, User> userMap);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "createdAt", source = "message.createdAt")
    @Mapping(target = "updatedAt", source = "message.updatedAt")
    @Mapping(target = "deletedAt", source = "message.deletedAt")
    @Mapping(target = "idMessage", source = "message.id")
    @Mapping(target = "reactions", ignore = true)
    MessageResponse toMessageResponse(Message message, User user);

    @Named("mapReactions")
    default List<MessageReactionResponse> mapReactions(List<MessageReaction> reactions, Map<Long, User> userMap) {
        if (reactions == null || reactions.isEmpty()) return Collections.emptyList();
        return reactions.stream().map(r -> {
            User u = userMap != null ? userMap.get(r.getUserId()) : null;
            return MessageReactionResponse.builder()
                    .userId(r.getUserId())
                    .userName(u != null ? u.getUserName() : null)
                    .avatar(u != null ? u.getAvatar() : null)
                    .icon(r.getIcon())
                    .build();
        }).collect(Collectors.toList());
    }
}
