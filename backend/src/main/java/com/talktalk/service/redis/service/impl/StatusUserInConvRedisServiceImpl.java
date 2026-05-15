package com.talktalk.service.redis.service.impl;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.talktalk.service.redis.service.StatusUserInConvRedisService;

@Service
public class StatusUserInConvRedisServiceImpl implements StatusUserInConvRedisService {

    @Autowired
    RedisTemplate<String, String> redisTemplate;

    private String getCacheKey(Long conversationId) {
        return "conv:active:" + conversationId;
    }

    private String getUserActiveKey(Long userId) {
        return "user:active_convs:" + userId;
    }

    @Override
    public Set<Long> getMemberUserInConv(Long conversationId) {
        Set<String> memberUserInConv = redisTemplate.opsForSet().members(getCacheKey(conversationId));
        return memberUserInConv.stream().map(Long::valueOf).collect(Collectors.toSet());
    }

    @Override
    public void setMemberInConv(Long conversationId, Long userId) {
        redisTemplate.opsForSet().add(getCacheKey(conversationId), String.valueOf(userId));
    }

    @Override
    public void setUserActiveInConv(Long userId, Long conversationId) {
        redisTemplate.opsForSet().add(getUserActiveKey(userId), String.valueOf(conversationId));
    }

    @Override
    public void deleteMemberInConv(Long conversationId, Long userId) {
        redisTemplate.opsForSet().remove(getCacheKey(conversationId), String.valueOf(userId));
    }

}
