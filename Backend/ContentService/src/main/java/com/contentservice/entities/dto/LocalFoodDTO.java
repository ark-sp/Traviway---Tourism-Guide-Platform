package com.contentservice.entities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LocalFoodDTO {

    private Integer foodId;
    private Integer cityId;

    @NotBlank(message = "Food name cannot be empty")
    @Size(max = 100, message = "Food name must be less than 100 characters")
    private String foodName;

    private String description;

    private String imageUrl;
}
