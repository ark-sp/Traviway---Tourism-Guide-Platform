package com.travyway.entities.dto;

import lombok.Data;

@Data
public class PlaceDetailDTO {

    private Integer placeId;
    private String title;
    private String description;
    // Add any other fields from Place that user-service might need

}
