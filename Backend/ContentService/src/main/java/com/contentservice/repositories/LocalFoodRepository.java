package com.contentservice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.contentservice.entities.LocalFood;

@Repository
public interface LocalFoodRepository extends JpaRepository<LocalFood, Integer> {

	List<LocalFood> findByCityCityId(Integer cityId);
}
