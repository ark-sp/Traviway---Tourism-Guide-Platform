package com.contentservice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.contentservice.entities.Place;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Integer> {

    List<Place> findByCityCityId(Integer cityId);

    List<Place> findByCategoryCategoryId(Integer categoryId);

    @Query("SELECT p FROM Place p WHERE " +
            "(:title IS NULL OR LOWER(p.title) LIKE CONCAT('%', LOWER(:title), '%')) AND " +
            "(:cityId IS NULL OR p.city.cityId = :cityId) AND " +
            "(:categoryId IS NULL OR p.category.categoryId = :categoryId)")
     List<Place> searchPlaces(String title, Integer cityId, Integer categoryId);

}

