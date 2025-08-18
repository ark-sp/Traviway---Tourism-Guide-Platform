package com.travyway.entities.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogDTO {
    private Integer blogId;

    @NotNull(message = "Place ID cannot be null")
    private Integer placeId; // Foreign key to Content Service's Place

    @NotNull(message = "User ID cannot be null")
    private Integer userId; // Foreign key to User

    @NotBlank(message = "Title cannot be empty")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    private String content;
    private LocalDateTime createdAt;

    // Optional: To display place title from content-service
    private String placeTitle;
}
