package com.talktalk.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.talktalk.service.SenderService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class SendMailServiceImpl implements SenderService {

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    String from;

    @Override
    public void sendOtp(String receiver, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        context.setVariable("otpCode", otp);
        String htmlContent = templateEngine.process("otp-template", context);

        helper.setTo(receiver);
        helper.setSubject("Mã OTP xác thực tài khoản");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

}
