package com.talktalk.service.redis;

public interface OtpRedisService {

    String getOtp(String key);

    void deleteOtp(String key);

    void setOtp(String key, String value);

    String generateOtp();
}
