package com.travyway.entities.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewDTO {

    private Integer reviewId;

    @NotNull(message = "Place ID cannot be null")
    private Integer placeId; // Foreign key to Content Service's Place

    @NotNull(message = "User ID cannot be null")
    private Integer userId; // Foreign key to User

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Short rating;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;

    private LocalDateTime createdAt;

    // Optional: To display place title from content-service
    private String placeTitle;

}
