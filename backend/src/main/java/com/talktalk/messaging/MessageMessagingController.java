package com.talktalk.messaging;

import com.talktalk.dto.request.ChatMessageRequest;
import com.talktalk.dto.response.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageMessagingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest request) {
        log.info("Received message from {}: {}", request.getSenderId(), request.getContent());
        
        ChatMessageResponse response = ChatMessageResponse.builder()
                .senderId(request.getSenderId())
                .roomId(request.getRoomId())
                .content(request.getContent())
                .messageType(request.getMessageType())
                .timestamp(LocalDateTime.now())
                .build();

        messagingTemplate.convertAndSend("/topic/room." + request.getRoomId(), response);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageRequest request) {
        log.info("User joined: {}", request.getSenderId());
        
        ChatMessageResponse response = ChatMessageResponse.builder()
                .senderId(request.getSenderId())
                .roomId(request.getRoomId())
                .messageType("JOIN")
                .timestamp(LocalDateTime.now())
                .build();

        messagingTemplate.convertAndSend("/topic/room." + request.getRoomId(), response);
    }
}
