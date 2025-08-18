package com.adminservice.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class ContactFormDTO {
    
    @NotBlank(message = "Name cannot be empty")
    private String name;
    
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email should be a valid email address")
    private String email;

    @NotBlank(message = "Message cannot be empty")
    @Size(min = 10, message = "Message must be at least 10 characters long")
    private String message;

}
