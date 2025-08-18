package com.adminservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adminservice.dto.ContactFormDTO;
import com.adminservice.service.EmailService;

import jakarta.validation.Valid;
import lombok.Value;

@RestController
@RequestMapping("/api/notifications")
public class ContactController {
	
	@Autowired
    private EmailService emailService;
    
    @org.springframework.beans.factory.annotation.Value("${contact.form.email}") // Get the destination email from application.properties
    private String contactEmail;

    @PostMapping("/contact")
    public ResponseEntity<String> submitContactForm(@Valid @RequestBody ContactFormDTO contactFormDTO) {
        try {
            emailService.sendContactForm(contactFormDTO, contactEmail);
            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to send message.");
        }
    }
	

}
