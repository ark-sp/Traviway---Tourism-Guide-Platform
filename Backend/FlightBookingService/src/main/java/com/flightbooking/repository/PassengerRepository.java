package com.flightbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flightbooking.entities.Passenger;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
}