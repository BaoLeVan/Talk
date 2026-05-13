package com.talktalk.config;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtDecoder jwtDecoder;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to carry the messages back to the
        // client on destinations prefixed with /topic
        config.enableSimpleBroker("/topic", "/queue");
        // Designate the /app prefix for messages that are bound for methods annotated
        // with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
        // For user-specific messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The endpoint that clients will use to connect to our WebSocket server
        registry.addEndpoint("/ws-talk")
                .setAllowedOriginPatterns("http://localhost:5173")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authToken = accessor.getFirstNativeHeader("Authorization");
                    if (authToken != null && authToken.startsWith("Bearer ")) {
                        String token = authToken.substring(7);

                        try {
                            Jwt jwt = jwtDecoder.decode(token);

                            String email = jwt.getClaimAsString("sub");
                            String scope = jwt.getClaimAsString("scope");

                            List<SimpleGrantedAuthority> authorities = List.of();
                            if (scope != null && !scope.isEmpty()) {
                                authorities = List.of(scope.split(" "))
                                        .stream()
                                        .map(SimpleGrantedAuthority::new)
                                        .collect(Collectors.toList());
                            }

                            Authentication authentication = new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    authorities);

                            accessor.setUser(authentication);

                        } catch (Exception e) {
                            log.error("Failed to authenticate WebSocket connection: {}", e.getMessage());
                        }
                    }
                }
                return message;
            }
        });
    }
}
