package com.example.praca_inzynierska.controllers;

import com.example.praca_inzynierska.util.email.EmailFormDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping(value = "/")
    public String indexPage(Model model){
        model.addAttribute("emailForm", new EmailFormDto());
        return "index";
    }
}
