package com.contentservice.entities.dto;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CityDTO {

    private Integer cityId;

    @NotBlank(message = "City name cannot be empty")
    @Size(max = 100, message = "City name must be less than 100 characters")
    private String cityName;

    private List<PlaceDTO> places;
    private List<LocalFoodDTO> localFoods;

    @NotBlank(message = "City image cannot be empty")
    @Size(max = 255, message = "City image URL must be less than 255 characters")
    private String cityImage;

    // --- Add these fields ---
    private Double latitude;
    private Double longitude;
}
