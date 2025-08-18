package com.travyway.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "visited_places")
@Data
public class VisitedPlace {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_id")
    private Integer visitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // In a microservice, we typically store the ID and fetch details via FeignClient
    @Column(name = "place_id")
    private Integer placeId; // Foreign key to content-service's places table

    @Column(name = "visited_at", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime visitedAt;

    @PrePersist
    protected void onCreate() {
        if (visitedAt == null) {
            visitedAt = LocalDateTime.now();
        }
    }



}
