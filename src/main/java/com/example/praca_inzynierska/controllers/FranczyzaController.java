package com.example.praca_inzynierska.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/*
 * Controller handling "/franczyza/**" endpoints
 * */

@Controller
@RequestMapping(value = "/franczyza")
public class FranczyzaController {

    @GetMapping(value = "/o-franczyzie")
    public String o_franczyzie(){
        return "franchisee/o_franczyzie";
    }
}
