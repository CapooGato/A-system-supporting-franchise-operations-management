package com.example.praca_inzynierska.service.impl;

import com.example.praca_inzynierska.model.Order;
import com.example.praca_inzynierska.repository.OrderRepository;
import com.example.praca_inzynierska.service.OrderService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> getAllOrders() { return orderRepository.findAll(); }

    @Override
    public Order createOrder(Order order) {
        order.setDate(LocalDate.now());
        return orderRepository.save(order);
    }
}
