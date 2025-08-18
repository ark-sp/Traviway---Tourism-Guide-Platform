package com.travyway.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travyway.entities.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer>{

    List<Review> findByUserUserId(Integer userId);
    List<Review> findByPlaceId(Integer placeId);
    Optional<Review> findByUserUserIdAndPlaceId(Integer userId, Integer placeId);

}
