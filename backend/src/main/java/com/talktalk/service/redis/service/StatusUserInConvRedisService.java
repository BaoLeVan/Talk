package com.talktalk.service.redis.service;

import java.util.Set;

public interface StatusUserInConvRedisService {
    Set<Long> getMemberUserInConv(Long conversationId);
    void setMemberInConv(Long conversationId, Long userId);
    void deleteMemberInConv(Long conversationId, Long userId);
    void setUserActiveInConv(Long userId, Long conversationId);
}
