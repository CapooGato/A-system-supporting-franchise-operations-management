package com.example.praca_inzynierska.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/admin")
@Controller
public class AdminController {

    @GetMapping("/dashboard")
    public String adminDashboardPage(){
        return "admin/admin_dashboard";
    }

    @GetMapping("/products")
    public String adminProductsPage(){
        return "admin/admin_products";
    }

    @GetMapping("/users")
    public String adminUsersPage(){
        return "admin/admin_users";
    }

    @GetMapping("/orders")
    public String adminOrdersPage(){
        return "admin/admin_orders";
    }
}

