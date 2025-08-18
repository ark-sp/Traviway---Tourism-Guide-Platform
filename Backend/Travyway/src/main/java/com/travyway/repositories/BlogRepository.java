package com.travyway.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travyway.entities.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer>{

    List<Blog> findByUserUserId(Integer userId);
    List<Blog> findByPlaceId(Integer placeId);

}
