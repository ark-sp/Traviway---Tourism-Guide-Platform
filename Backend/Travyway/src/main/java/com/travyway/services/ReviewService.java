package com.travyway.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travyway.entities.Review;
import com.travyway.entities.User;
import com.travyway.entities.dto.PlaceDetailDTO;
import com.travyway.entities.dto.ReviewDTO;
import com.travyway.exception.ResourceNotFoundException;
import com.travyway.feignclientservices.ContentServiceClient;
import com.travyway.repositories.ReviewRepository;
import com.travyway.repositories.UserRepository;

import feign.FeignException;
import jakarta.transaction.Transactional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContentServiceClient contentServiceClient;

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ReviewDTO> getReviewById(Integer id) {
        return reviewRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<ReviewDTO> getReviewsByUserId(Integer userId) {
        return reviewRepository.findByUserUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByPlaceId(Integer placeId) {
        return reviewRepository.findByPlaceId(placeId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + reviewDTO.getUserId()));

        // Check if user has already reviewed this place
        if (reviewRepository.findByUserUserIdAndPlaceId(reviewDTO.getUserId(), reviewDTO.getPlaceId()).isPresent()) {
            throw new IllegalArgumentException("User has already reviewed this place.");
        }

        // Validate that the place exists by calling the content-service
        try {
            PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(reviewDTO.getPlaceId());
            if (placeDetails == null || placeDetails.getPlaceId() == null) {
                 throw new ResourceNotFoundException("Place not found in content-service with id: " + reviewDTO.getPlaceId());
            }
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Place not found in content-service with id: " + reviewDTO.getPlaceId());
        }

        Review review = new Review();
        BeanUtils.copyProperties(reviewDTO, review, "reviewId", "userId", "placeTitle");
        review.setUser(user);
        review.setPlaceId(reviewDTO.getPlaceId());
        return convertToDto(reviewRepository.save(review));
    }

    @Transactional
    public Optional<ReviewDTO> updateReview(Integer id, ReviewDTO reviewDTO) {
        return reviewRepository.findById(id)
                .flatMap(existingReview -> {
                    Optional<User> userOptional = userRepository.findById(reviewDTO.getUserId());
                    if (userOptional.isEmpty()) {
                        return Optional.empty(); // User not found
                    }

                    PlaceDetailDTO placeDetails = null;
                    try {
                        placeDetails = contentServiceClient.getPlaceById(reviewDTO.getPlaceId());
                    } catch (Exception e) {
                        System.err.println("Place not found or content-service unreachable for placeId: " + reviewDTO.getPlaceId());
                        return Optional.empty();
                    }
                    if (placeDetails == null || placeDetails.getPlaceId() == null) {
                         return Optional.empty(); // Place not found
                    }

                    BeanUtils.copyProperties(reviewDTO, existingReview, "reviewId", "userId", "placeTitle", "createdAt");
                    existingReview.setUser(userOptional.get());
                    existingReview.setPlaceId(reviewDTO.getPlaceId());
                    return Optional.of(convertToDto(reviewRepository.save(existingReview)));
                });
    }

    @Transactional
    public boolean deleteReview(Integer id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ReviewDTO convertToDto(Review review) {
        ReviewDTO dto = new ReviewDTO();
        BeanUtils.copyProperties(review, dto);
        dto.setUserId(review.getUser() != null ? review.getUser().getUserId() : null);
        dto.setPlaceId(review.getPlaceId());

        if (review.getPlaceId() != null) {
            try {
                PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(review.getPlaceId());
                if (placeDetails != null) {
                    dto.setPlaceTitle(placeDetails.getTitle());
                }
            } catch (Exception e) {
                System.err.println("Could not fetch place title for review " + review.getReviewId() + ": " + e.getMessage());
                dto.setPlaceTitle("N/A (Place Service Error)");
            }
        }
        return dto;
    }



}
