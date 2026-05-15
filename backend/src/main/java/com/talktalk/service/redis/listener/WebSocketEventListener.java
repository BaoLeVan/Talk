package com.talktalk.service.redis.listener;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.talktalk.service.UserService;
import com.talktalk.service.redis.service.StatusUserInConvRedisService;

@Component
public class WebSocketEventListener {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private StatusUserInConvRedisService statusUserInConvRedisService;

    @Autowired
    UserService userService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Lấy userId từ Principal (nếu bạn đã cấu hình Spring Security cho WebSocket)
        if (event.getUser() != null) {
            String userId = userService.findByEmailForSocket(event.getUser().getName()).getId().toString();

            // 1. Lấy danh sách các conversation mà user này đang tham gia từ Redis
            String userActiveKey = "user:active_convs:" + userId;
            Set<String> activeConvs = redisTemplate.opsForSet().members(userActiveKey);

            if (activeConvs != null) {
                activeConvs.forEach(convId -> {
                    // 2. Xóa user khỏi từng conversation trong Redis (Set của convId)
                    statusUserInConvRedisService.deleteMemberInConv(Long.valueOf(convId), Long.valueOf(userId));
                });
            }

            // 3. Xóa luôn key quản lý danh sách hội thoại của user đó
            redisTemplate.delete(userActiveKey);
        }
    }
}
