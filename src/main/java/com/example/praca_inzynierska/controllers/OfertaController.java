package com.example.praca_inzynierska.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/*
* Controller handling "/oferta/**" endpoints
* */
@Controller()
@RequestMapping(value = "/oferta")
public class OfertaController {

    @GetMapping(value = "/sklep-menu")
    public String sklep_menu(){
        return "franchisee/sklep_menu";
    }
}
