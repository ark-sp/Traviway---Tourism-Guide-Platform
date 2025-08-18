package com.travyway.controller;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travyway.entities.dto.ReviewDTO;
import com.travyway.services.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/travyway/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        List<ReviewDTO> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Integer id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Integer userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUserId(userId);
        if (reviews.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/by-place/{placeId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByPlaceId(@PathVariable Integer placeId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByPlaceId(placeId);
        if (reviews.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Integer id, @Valid @RequestBody ReviewDTO reviewDTO) {
        return reviewService.updateReview(id, reviewDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        if (reviewService.deleteReview(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
