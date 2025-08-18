package com.contentservice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.contentservice.entities.PlaceImage;

@Repository
public interface PlaceImageRepository extends JpaRepository<PlaceImage, Integer> {

	List<PlaceImage> findByPlacePlaceId(Integer placeId);
}
