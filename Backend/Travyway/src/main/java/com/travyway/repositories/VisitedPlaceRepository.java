package com.travyway.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travyway.entities.VisitedPlace;

@Repository
public interface VisitedPlaceRepository extends JpaRepository<VisitedPlace, Integer>{

    List<VisitedPlace> findByUserUserId(Integer userId);
    Optional<VisitedPlace> findByUser_UserIdAndPlaceId(Integer userId, Integer placeId);

}
