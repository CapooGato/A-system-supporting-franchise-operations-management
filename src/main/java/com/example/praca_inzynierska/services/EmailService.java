package com.example.praca_inzynierska.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    public final static String serverEmail = "u1361693913@gmail.com";
    public final static String sendingEmail = "hello@bakestorycrm.pl";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendEmail(String to, String from, String subject, String body){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setFrom(from);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
