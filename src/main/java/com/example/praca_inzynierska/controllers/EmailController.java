package com.example.praca_inzynierska.controllers;

import com.example.praca_inzynierska.services.EmailService;
import com.example.praca_inzynierska.util.email.EmailFormDto;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/api-email")
@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-email")
    public String sendEmailToServerAddress(EmailFormDto form){

        String body = String.format("Name & lastname: %s\nEmail: %s\nPhone number: %s\n" +
                "City: %s\nExperience in gastronomy: %s\nAdditional information: %s\n",
                form.getNameAndLastName(), form.getEmail(), form.getPhone(), form.getCity(),
                form.getExperience(), form.getMessage());

        emailService.sendEmail(
                EmailService.serverEmail,
                EmailService.sendingEmail,
                "Franchisee",
                body
        );

        return "OK";
    }
}
