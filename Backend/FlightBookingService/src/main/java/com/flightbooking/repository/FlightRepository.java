package com.flightbooking.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flightbooking.entities.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
}