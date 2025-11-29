package com.example.praca_inzynierska.controllers.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/admin")
@Controller
public class AdminController {

    @GetMapping("/admin-dashboard")
    public String adminDashboardPage(){
        return "admin/admin_dashboard";
    }

    @GetMapping("/admin-products")
    public String adminProductsPage(){
        return "admin/admin_products";
    }

    @GetMapping("/admin-users")
    public String adminUsersPage(){
        return "admin/admin_users";
    }

    @GetMapping("/admin-orders")
    public String adminOrdersPage(){
        return "admin/admin_orders";
    }
}

