package com.talktalk.service;

import jakarta.mail.MessagingException;

public interface SenderService {
    void sendOtp(String receiver, String otp) throws MessagingException;
}
