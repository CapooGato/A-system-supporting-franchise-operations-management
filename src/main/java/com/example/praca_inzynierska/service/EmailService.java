package com.example.praca_inzynierska.service;

import org.springframework.scheduling.annotation.Async;

public interface EmailService {
    @Async
    void sendEmail(String subject, String body);
}
