package com.talktalk.service.redis.impl;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.talktalk.service.redis.OtpRedisService;

@Service
public class OtpRedisServiceImpl implements OtpRedisService {

    @Autowired
    RedisTemplate<String, String> redisTemplate;

    @Override
    public String getOtp(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteOtp(String key) {
        redisTemplate.delete(key);
    }

    @Override
    public void setOtp(String key, String value) {
        redisTemplate.opsForValue().set(key, value, 5, TimeUnit.MINUTES);
    }

    @Override
    public String generateOtp() {
        Random random = new Random();
        return String.valueOf(random.nextInt(999999) + 100000);
    }
}
