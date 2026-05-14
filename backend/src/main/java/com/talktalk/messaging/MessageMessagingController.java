package com.talktalk.messaging;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.request.HandleSocketRequest;
import com.talktalk.dto.request.ReadReceiptRequest;
import com.talktalk.dto.response.MessageResponse;
import com.talktalk.dto.response.ReadReceiptResponse;
import com.talktalk.dto.response.RoleUserInConversation;
import com.talktalk.exception.enums.MemberRole;
import com.talktalk.service.ConversationsMemberService;
import com.talktalk.service.MessagesService;
import com.talktalk.utils.Utils;

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
    Utils utils;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest request) {
        log.info("Received message from {}: {}", request.getSenderId(), request.getContent());

        MessageResponse response = messagesService.createMessage(request);
        messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), response);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload HandleSocketRequest request) {
        log.info("User joined: {}", request.getUserTargetIds().toArray());
        RoleUserInConversation role = conversationsMemberService.getRoleUserInConversation(request.getConversationId(),
                request.getUserId());
        if (role.getRole() == MemberRole.ADMIN) {
            conversationsMemberService.addMemberInGroup(request.getConversationId(), request.getUserTargetIds());
            MessageResponse messageResponse = messagesService.createAddMemberMessage(request);
            messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), messageResponse);
        }
    }

    @MessageMapping("/chat.deleteUser")
    public void deleteUser(@Payload HandleSocketRequest request) {
        log.info("User deleted: {}", request.getUserTargetIds().get(0));
        RoleUserInConversation role = conversationsMemberService.getRoleUserInConversation(request.getConversationId(),
                request.getUserId());
        if (role.getRole() == MemberRole.ADMIN) {
            conversationsMemberService.removeMemberInGroup(request.getConversationId(),
                    request.getUserTargetIds().get(0));
            MessageResponse messageResponse = messagesService.createRemoveMemberMessage(request);
            messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), messageResponse);
        }
    }

    @MessageMapping("/chat.leaveGroup")
    public void leaveGroup(@Payload HandleSocketRequest request) {
        log.info("User leaving group: {}", request.getUserId());
        MessageResponse messageResponse = messagesService.createLeaveMessage(request);
        conversationsMemberService.leaveGroup(request.getConversationId(), request.getUserId());
        messagingTemplate.convertAndSend("/topic/room." + request.getConversationId(), messageResponse);
    }

    @MessageMapping("/chat.markRead")
    public void markRead(@Payload ReadReceiptRequest request, Principal principal) {
        Long userId = utils.getUserIdFromPrincipal(principal);
        log.info("Mark read conversation: {}, user: {}, lastMsg: {}", request.getConversationId(), userId,
                request.getLastReadMessageId());
        messagesService.markRead(request.getConversationId(), request.getLastReadMessageId(), userId);
        ReadReceiptResponse receipt = ReadReceiptResponse.builder()
                .conversationId(request.getConversationId())
                .userId(userId)
                .lastReadMessageId(request.getLastReadMessageId())
                .build();
        messagingTemplate.convertAndSend("/topic/room." + request.getConversationId() + ".read", receipt);
    }
}
