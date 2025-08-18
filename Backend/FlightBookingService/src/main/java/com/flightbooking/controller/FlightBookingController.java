package com.flightbooking.controller;

import com.amadeus.resources.FlightOfferSearch;
import com.flightbooking.entities.dto.FlightDto;
import com.flightbooking.service.FlightBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/flights")
public class FlightBookingController {

    @Autowired
    private FlightBookingService flightBookingService;

    @GetMapping("/search")
    public ResponseEntity<List<FlightDto>> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String date) {
        try {
            FlightOfferSearch[] offers = flightBookingService.searchFlights(origin, destination, date);

            List<FlightDto> flights = new ArrayList<>();

            if (offers != null) {
                for (FlightOfferSearch offer : offers) {
                    FlightDto dto = new FlightDto();
                    dto.setAmadeusFlightOfferId(offer.getId());

                    try {
                        if (offer.getItineraries() != null && offer.getItineraries().length > 0) {
                            var itinerary = offer.getItineraries()[0];
                            var segments = itinerary.getSegments();
                            if (segments != null && segments.length > 0) {
                                var firstSegment = segments[0];
                                var lastSegment = segments[segments.length - 1];
                                dto.setOrigin(firstSegment.getDeparture().getIataCode());
                                dto.setDestination(lastSegment.getArrival().getIataCode());
                                dto.setDepartureTime(firstSegment.getDeparture().getAt());
                                dto.setArrivalTime(lastSegment.getArrival().getAt());
                                dto.setAirlineCode(firstSegment.getCarrierCode());
                            }
                        }

                        if (offer.getPrice() != null) {
                            dto.setPrice(offer.getPrice().getTotal());
                            dto.setCurrency(offer.getPrice().getCurrency());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    // Add only if the destination matches what user requested
                    if (dto.getDestination() != null && dto.getDestination().equalsIgnoreCase(destination)) {
                        flights.add(dto);
                    }
                }
            }


            return ResponseEntity.ok(flights);

        } catch (DateTimeParseException dtpe) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format. Use yyyy-MM-dd");
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error searching flights: " + ex.getMessage());
        }
    }
}
