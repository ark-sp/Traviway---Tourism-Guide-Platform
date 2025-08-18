package com.travyway.entities.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

    private Integer userId;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must be less than 255 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password; // Used for input, will be hashed

    private String role;
    private LocalDate createdAt;

    @Size(max = 255, message = "Display name must be less than 255 characters")
    private String userName; // Corresponds to the user's display name (user_name in the database)
}
