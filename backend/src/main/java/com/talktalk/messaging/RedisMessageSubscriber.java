package com.talktalk.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String msg = new String(message.getBody());
        log.info("Received from Redis: {}", msg);
        
        // In a real app, you would parse the JSON and route it to the correct STOMP topic
        // For now, let's assume it's a global broadcast or we extract the roomId from the message
        messagingTemplate.convertAndSend("/topic/public", msg);
    }
}
