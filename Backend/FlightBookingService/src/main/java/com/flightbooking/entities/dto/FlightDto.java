package com.flightbooking.entities.dto;

import lombok.Data;

@Data
public class FlightDto {
	private String amadeusFlightOfferId;
	private String origin;
	private String destination;
	private String departureTime; // Use String for easier JSON serialization
	private String arrivalTime;
	private String airlineCode;
	private String price;
	private String currency;
}
