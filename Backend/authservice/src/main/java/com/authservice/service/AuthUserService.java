package com.authservice.service;

import com.authservice.model.User;
import com.authservice.repository.UserRepository;
import com.authservice.dto.UserDTO;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthUserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
    
    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(user -> {
            UserDTO dto = new UserDTO();
            BeanUtils.copyProperties(user, dto, "passwordHash");
            return dto;
        });
    }

    @Transactional
    public UserDTO registerUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User();
        BeanUtils.copyProperties(userDTO, user, "userId", "password");
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        if (userDTO.getRole() == null || userDTO.getRole().isEmpty()) {
            user.setRole("user");
        } else {
            user.setRole(userDTO.getRole());
        }
        return convertToDto(userRepository.save(user));
    }

    // Optional: updateCredentials method commented out - add if needed

    public UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto, "passwordHash");
        dto.setPassword(null);
        return dto;
    }
    public Optional<UserDTO> findByUsername(String username) {
        return userRepository.findByUsername(username)
                    .map(this::convertToDto);
    }

}
