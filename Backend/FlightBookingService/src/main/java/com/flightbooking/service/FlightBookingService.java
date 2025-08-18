package com.flightbooking.service;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.FlightOfferSearch;

import com.flightbooking.exception.AmadeusApiException;
import com.flightbooking.entities.*;
import com.flightbooking.entities.dto.BookingRequest;
//import com.flightbooking.model.Flight;
//import com.flightbooking.model.Passenger;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightBookingService {

    @Autowired
    private FlightRepository flightRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PassengerRepository passengerRepository;

    private final Amadeus amadeus;

    public FlightBookingService(@Value("${amadeus.api.key}") String apiKey,
                                @Value("${amadeus.api.secret}") String apiSecret) {
        this.amadeus = Amadeus.builder(apiKey, apiSecret).build();
    }

    public FlightOfferSearch[] searchFlights(String origin, String destination, String departureDate) {
        try {
            return amadeus.shopping.flightOffersSearch.get(
                Params.with("originLocationCode", origin)
                    .and("destinationLocationCode", destination)
                    .and("departureDate", departureDate)
                    .and("adults", 1)
                    .and("currencyCode", "INR")
            );
        } catch (ResponseException e) {
            throw new AmadeusApiException("Amadeus API error: " + e.getDescription(), e);
        }
    }

    @Transactional
    public Booking bookFlight(BookingRequest bookingRequest) {
        // Here you would call Amadeus API to confirm the booking before saving to DB
        // For this example, we'll assume the booking is successful and save the data

        // You would find the flight details from a previous search or Amadeus API call
        Flight flight = new Flight();
        flight.setAmadeusFlightOfferId(bookingRequest.getAmadeusFlightOfferId());
        // Populate other flight details from Amadeus API response if needed
        flightRepository.save(flight);

        Booking booking = new Booking();
        booking.setFlightId(flight.getId());
        booking.setUserId(1L); // Hardcoded for this example, should come from auth token
        booking.setStatus("CONFIRMED");
        Booking savedBooking = bookingRepository.save(booking);

        List<Passenger> passengers = bookingRequest.getPassengers().stream().map(dto -> {
            Passenger passenger = new Passenger();
            passenger.setFirstName(dto.getFirstName());
            passenger.setLastName(dto.getLastName());
            passenger.setEmail(dto.getEmail());
            passenger.setBooking(savedBooking);
            return passenger;
        }).collect(Collectors.toList());

        passengerRepository.saveAll(passengers);
        savedBooking.setPassengers(passengers);

        return savedBooking;
    }
}