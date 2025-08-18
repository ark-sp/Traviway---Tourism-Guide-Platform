package com.flightbooking.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId; // Assuming userId is passed from an authenticated user
    private Long flightId; // The ID of the flight they are booking
    private LocalDateTime bookingDate;
    private String status; // CONFIRMED, PENDING, CANCELLED

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Passenger> passengers;

    @PrePersist
    protected void onCreate() {
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING";
        }
    }
}