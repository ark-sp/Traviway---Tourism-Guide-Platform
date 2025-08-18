package com.contentservice.repositories;

import java.util.Optional; // Import Optional if not already present

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.contentservice.entities.City;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {

	Optional<City> findByCityName(String cityName);

    // Corrected method name: findByCityId instead of findByCityCityId
    // This directly queries by the 'cityId' property of the City entity
    Optional<City> findByCityId(Integer cityId);
}