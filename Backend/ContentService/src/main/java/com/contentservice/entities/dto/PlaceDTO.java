package com.contentservice.entities.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlaceDTO {

    private Integer placeId;

    private Integer categoryId;
    private Integer cityId;

    @NotBlank(message = "Place title cannot be empty")
    @Size(max = 200, message = "Place title must be less than 200 characters")
    private String title;

    private String description;
    private String howToReach;
    private LocalDateTime createdAt;
    private List<PlaceImageDTO> placeImages;
    private Double latitude;
    private Double longitude;

}
