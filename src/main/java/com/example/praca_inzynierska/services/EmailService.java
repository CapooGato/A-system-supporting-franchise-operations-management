package com.example.praca_inzynierska.services;

import org.springframework.scheduling.annotation.Async;

public interface EmailService {
    @Async
    void sendEmail(String subject, String body);
}
