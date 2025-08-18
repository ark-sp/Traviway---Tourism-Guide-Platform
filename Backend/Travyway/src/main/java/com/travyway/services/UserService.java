package com.travyway.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.travyway.entities.User;
import com.travyway.entities.dto.UserDTO;
import com.travyway.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

     @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> getUserById(Integer id) {
        return userRepository.findById(id)
                .map(this::convertToDto);
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        BeanUtils.copyProperties(userDTO, user, "userId", "password"); // Exclude ID and raw password
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword())); // Hash the password
        if (userDTO.getRole() == null || userDTO.getRole().isEmpty()) {
            user.setRole("user"); // Default role
        } else {
            user.setRole(userDTO.getRole());
        }
        return convertToDto(userRepository.save(user));
    }

    @Transactional
    public Optional<UserDTO> updateUser(Integer id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    BeanUtils.copyProperties(userDTO, existingUser, "userId", "password", "createdAt"); // Exclude ID, password, createdAt
                    if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                        existingUser.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
                    }
                    return convertToDto(userRepository.save(existingUser));
                });
    }

    @Transactional
    public boolean deleteUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto, "passwordHash"); // Exclude password hash from DTO
        dto.setPassword(null); // Ensure password field is null in DTO for security
        return dto;
    }
}
