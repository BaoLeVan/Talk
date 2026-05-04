package com.talktalk.messaging;

import java.time.LocalDateTime;
import java.util.Collections;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.request.HandleSocketRequest;
import com.talktalk.dto.response.ChatMessageResponse;
import com.talktalk.dto.response.MessageResponse;
import com.talktalk.dto.response.RoleUserInConversation;
import com.talktalk.exception.enums.MemberRole;
import com.talktalk.service.ConversationsMemberService;
import com.talktalk.service.MessagesService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MessageMessagingController {

    SimpMessagingTemplate messagingTemplate;
    MessagesService messagesService;
    ConversationsMemberService conversationsMemberService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest request) {
        log.info("Received message from {}: {}", request.getSenderId(), request.getContent());

        MessageResponse response = messagesService.createMessage(request);
        messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), response);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageRequest request) {
        log.info("User joined: {}", request.getSenderId());
        
        ChatMessageResponse response = ChatMessageResponse.builder()
                .senderId(request.getSenderId())
                .conversationId(request.getConversationId())
                .messageType("JOIN")
                .attachments(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();

        messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), response);
    }

    @MessageMapping("/chat.deleteUser")
    public void deleteUser(@Payload HandleSocketRequest request) {
        log.info("User deleted: {}", request.getUserDeleteId());
        RoleUserInConversation role = conversationsMemberService.getRoleUserInConversation(request.getConversationId(), request.getUserId());
        if (role.getRole() == MemberRole.ADMIN) {
            conversationsMemberService.removeMemberInGroup(request.getConversationId(), request.getUserDeleteId());
            ChatMessageResponse response = ChatMessageResponse.builder()
                .conversationId(request.getConversationId())
                .content(request.getUserDeleteName() + " has been removed from the group by " + role.getUserName())
                .messageType("REMOVE_BY_ADMIN")
                .timestamp(LocalDateTime.now())
                .build();
            messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), response);
        } 
    }
}
