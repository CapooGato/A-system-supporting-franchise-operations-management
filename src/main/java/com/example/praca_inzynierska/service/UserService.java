package com.example.praca_inzynierska.service;

import com.example.praca_inzynierska.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
     List<User> getAllUsers();
     User getUserById(Long id);
     User saveUser(User user);
     void deleteUser(Long id);
     ResponseEntity<User> updateUser(Long id, User userDetails);
}
