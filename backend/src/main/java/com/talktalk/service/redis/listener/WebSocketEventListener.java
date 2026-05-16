package com.talktalk.service.redis.listener;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.talktalk.service.UserService;
import com.talktalk.service.redis.service.StatusUserInConvRedisService;
import com.talktalk.utils.Utils;

@Component
public class WebSocketEventListener {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private StatusUserInConvRedisService statusUserInConvRedisService;

    @Autowired
    UserService userService;


    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {

        if (event.getUser() != null) {
            String userId = userService.findByEmailForSocket(event.getUser().getName()).getId().toString();
            redisTemplate.opsForSet().add(Utils.ONLINE_USERS_KEY, userId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        if (event.getUser() != null) {
            String userId = userService.findByEmailForSocket(event.getUser().getName()).getId().toString();
            String userActiveKey = "user:active_convs:" + userId;
            Set<String> activeConvs = redisTemplate.opsForSet().members(userActiveKey);

            if (activeConvs != null) {
                activeConvs.forEach(convId -> {
                    statusUserInConvRedisService.deleteMemberInConv(Long.valueOf(convId), Long.valueOf(userId));
                });
            }
            redisTemplate.delete(userActiveKey);
            redisTemplate.opsForSet().remove(Utils.ONLINE_USERS_KEY, userId);
        }
    }
}
