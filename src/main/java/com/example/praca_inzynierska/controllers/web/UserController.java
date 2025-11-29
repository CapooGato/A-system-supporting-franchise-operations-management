package com.example.praca_inzynierska.controllers.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/order")
    public String orderPage(){
        return "order";
    }

    @GetMapping("/my-orders")
    public String myOrdersPage(){
        return "my_orders";
    }

    @GetMapping("/products")
    public String productsPage(){
        return "products";
    }

    @GetMapping("/dashboard")
    public String dashboardPage(){
        return "dashboard";
    }

    @GetMapping("/materials")
    public String materialsPage(){
        return "materials";
    }

    @GetMapping("/support")
    public String supportPage(){
        return "support";
    }
}
