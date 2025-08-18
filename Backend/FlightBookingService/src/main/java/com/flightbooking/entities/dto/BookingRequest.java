package com.flightbooking.entities.dto;
import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private String amadeusFlightOfferId;
    private List<PassengerDTO> passengers;
}