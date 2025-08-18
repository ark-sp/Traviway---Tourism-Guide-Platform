package com.contentservice.entities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlaceImageDTO {

    private Integer imageId;
    private Integer placeId;
    @NotBlank(message = "Image URL cannot be empty")
    @Size(max = 500, message = "Image URL must be less than 500 characters")
    private String imageUrl;
}
