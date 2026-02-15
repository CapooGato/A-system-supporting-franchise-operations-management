package com.example.praca_inzynierska.service;

import com.example.praca_inzynierska.model.Ticket;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TicketService {
     List<Ticket> getAllTickets();
     Ticket updateStatus(Long id, String status);
}