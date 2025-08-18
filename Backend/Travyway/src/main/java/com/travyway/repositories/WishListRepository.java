package com.travyway.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travyway.entities.WishList;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Integer>{

    List<WishList> findByUserUserId(Integer userId);
    Optional<WishList> findByUser_UserIdAndPlaceId(Integer userId, Integer placeId);


}
