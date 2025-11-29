package com.example.praca_inzynierska.controllers.api;

import com.example.praca_inzynierska.services.EmailService;
import com.example.praca_inzynierska.dtos.EmailFormDto;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RequestMapping("/api-email")
@Controller
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-email")
    public String emailSubmit(@Valid @ModelAttribute("emailForm") EmailFormDto form,
                              BindingResult result){

        if(result.hasErrors()){
            return "index";
        }

        String body = String.format("Name & lastname: %s%nEmail: %s%nPhone number: %s%n" +
                "City: %s%nExperience in gastronomy: %s%nAdditional information: %s%n",
                form.getNameAndLastName(), form.getEmail(), form.getPhoneNumber(), form.getCity(),
                form.getExperience(), form.getMessage());

        emailService.sendEmail(
                "Franchisee",
                body
        );

        return "redirect:/";
    }
}
