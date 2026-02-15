package com.example.praca_inzynierska.controller.api;

import com.example.praca_inzynierska.model.Order;
import com.example.praca_inzynierska.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAll() { return orderService.getAllOrders(); }

    @PostMapping
    public Order add(@RequestBody Order order) { return orderService.createOrder(order); }
}