package com.example.praca_inzynierska.service.impl;

import com.example.praca_inzynierska.model.Ticket;
import com.example.praca_inzynierska.repository.TicketRepository;
import com.example.praca_inzynierska.service.TicketService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    public TicketServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public List<Ticket> getAllTickets() { return ticketRepository.findAll(); }

    @Override
    public Ticket updateStatus(Long id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }
}
