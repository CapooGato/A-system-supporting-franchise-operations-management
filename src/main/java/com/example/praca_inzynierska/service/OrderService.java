package com.example.praca_inzynierska.service;

import com.example.praca_inzynierska.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OrderService {
    List<Order> getAllOrders();
    Order createOrder(Order order);
}
