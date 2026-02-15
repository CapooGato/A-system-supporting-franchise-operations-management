package com.example.praca_inzynierska.service.impl;

import com.example.praca_inzynierska.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    public final static String SERVER_EMAIL = "u1361693913@gmail.com";
    public final static String SENDING_EMAIL = "hello@bakestorycrm.pl";

    @Async
    @Override
    public void sendEmail(String subject, String body){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(SERVER_EMAIL);
        message.setFrom(SENDING_EMAIL);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
}
