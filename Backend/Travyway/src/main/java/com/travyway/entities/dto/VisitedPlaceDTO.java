package com.travyway.entities.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VisitedPlaceDTO {

    private Integer visitId;

    @NotNull(message = "User ID cannot be null")
    private Integer userId;

    @NotNull(message = "Place ID cannot be null")
    private Integer placeId;

    private LocalDateTime visitedAt;

    // Optional: To display place title from content-service
    private String placeTitle;

}
//AIzaSyBjL5Z26m3nHkLPzeGwBNQRuUNGMqYmWVE