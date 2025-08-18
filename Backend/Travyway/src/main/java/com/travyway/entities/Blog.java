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
@Table(name = "blogs")
@Data
public class Blog {

	 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blog_id")
    private Integer blogId;

    // In a microservice, we typically store the ID and fetch details via FeignClient
    @Column(name = "place_id", nullable = false)
    private Integer placeId; // Foreign key to content-service's places table

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who wrote the blog

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
	 	
}
