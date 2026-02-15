package com.example.praca_inzynierska.service.impl;

import com.example.praca_inzynierska.model.User;
import com.example.praca_inzynierska.repository.UserRepository;
import com.example.praca_inzynierska.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public ResponseEntity<User> updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(userDetails.getFirstName());
                    user.setLastName(userDetails.getLastName());
                    user.setEmail(userDetails.getEmail());
                    user.setRole(userDetails.getRole()); // Pamiętaj o roli!
                    user.setCompany(userDetails.getCompany());
                    user.setActive(userDetails.isActive());

                    // Aktualizujemy hasło tylko jeśli zostało podane w formularzu
                    if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                        user.setPassword(userDetails.getPassword());
                    }

                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}