package com.authservice.controller;

import com.authservice.dto.UserDTO;
import com.authservice.dto.VerifyOtpRequest;
import com.authservice.dto.AuthRequest;
import com.authservice.dto.AuthResponse;
import com.authservice.dto.OTPRequest;
import com.authservice.dto.ResetPasswordRequest;
//import com.authservice.dto.UpdateCredentialsRequest;
import com.authservice.jwt.JwtUtil;
import com.authservice.model.User;
import com.authservice.service.AuthUserService;
import com.authservice.service.PasswordResetService;

import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthUserService authUserService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            UserDTO createdUser = authUserService.registerUser(userDTO);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.CONFLICT);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Incorrect username or password");
        }

        User user = (User) authUserService.loadUserByUsername(authRequest.getUsername());
        String jwt = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(jwt, "Login successful"));
    }
    
//    @PostMapping("/update-credentials")
//    public ResponseEntity<?> updateCredentials(@Valid @RequestBody UpdateCredentialsRequest req) {
//        try {
//            UserDTO updatedUser = authUserService.updateCredentials(req);
//            return ResponseEntity.ok(updatedUser);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
//        }
//    }
    
    @PostMapping("/forgot-password/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody OTPRequest req) {
        passwordResetService.generateAndSendOtp(req.getEmail());
        return ResponseEntity.ok("If the email is registered, an OTP has been sent.");
    }
    
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest req) {
        boolean isValid = passwordResetService.verifyOtp(req.getEmail(), req.getOtp());
        if (isValid) {
            return ResponseEntity.ok("OTP verified");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
        }
    }
    
    @PostMapping("/forgot-password/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        try {
            passwordResetService.resetPassword(req);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}

