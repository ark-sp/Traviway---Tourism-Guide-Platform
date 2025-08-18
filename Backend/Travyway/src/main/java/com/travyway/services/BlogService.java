package com.travyway.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travyway.entities.Blog;
import com.travyway.entities.User;
import com.travyway.entities.dto.BlogDTO;
import com.travyway.entities.dto.PlaceDetailDTO;
import com.travyway.feignclientservices.ContentServiceClient;
import com.travyway.repositories.BlogRepository;
import com.travyway.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContentServiceClient contentServiceClient; // Feign client for content-service

    public List<BlogDTO> getAllBlogs() {
        return blogRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BlogDTO> getBlogById(Integer id) {
        return blogRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<BlogDTO> getBlogsByUserId(Integer userId) {
        return blogRepository.findByUserUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BlogDTO> getBlogsByPlaceId(Integer placeId) {
        return blogRepository.findByPlaceId(placeId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<BlogDTO> createBlog(BlogDTO blogDTO) {
        Optional<User> userOptional = userRepository.findById(blogDTO.getUserId());
        if (userOptional.isEmpty()) {
            return Optional.empty(); // User not found
        }

        // Validate placeId by calling content-service
        PlaceDetailDTO placeDetails = null;
        try {
            placeDetails = contentServiceClient.getPlaceById(blogDTO.getPlaceId());
        } catch (Exception e) {
            // Log error, but for creation, if place doesn't exist, we might reject
            System.err.println("Place not found or content-service unreachable for placeId: " + blogDTO.getPlaceId());
            return Optional.empty(); // Place not found or service error
        }
        if (placeDetails == null || placeDetails.getPlaceId() == null) {
             return Optional.empty(); // Place not found
        }

        Blog blog = new Blog();
        BeanUtils.copyProperties(blogDTO, blog, "blogId", "userId", "placeTitle"); // Exclude generated ID and DTO-only fields
        blog.setUser(userOptional.get());
        blog.setPlaceId(blogDTO.getPlaceId()); // Store just the ID
        return Optional.of(convertToDto(blogRepository.save(blog)));
    }

    @Transactional
    public Optional<BlogDTO> updateBlog(Integer id, BlogDTO blogDTO) {
        return blogRepository.findById(id)
                .flatMap(existingBlog -> {
                    Optional<User> userOptional = userRepository.findById(blogDTO.getUserId());
                    if (userOptional.isEmpty()) {
                        return Optional.empty(); // User not found
                    }

                    // Validate placeId by calling content-service
                    PlaceDetailDTO placeDetails = null;
                    try {
                        placeDetails = contentServiceClient.getPlaceById(blogDTO.getPlaceId());
                    } catch (Exception e) {
                        System.err.println("Place not found or content-service unreachable for placeId: " + blogDTO.getPlaceId());
                        return Optional.empty();
                    }
                    if (placeDetails == null || placeDetails.getPlaceId() == null) {
                         return Optional.empty(); // Place not found
                    }

                    BeanUtils.copyProperties(blogDTO, existingBlog, "blogId", "userId", "placeTitle", "createdAt");
                    existingBlog.setUser(userOptional.get());
                    existingBlog.setPlaceId(blogDTO.getPlaceId());
                    return Optional.of(convertToDto(blogRepository.save(existingBlog)));
                });
    }

    @Transactional
    public boolean deleteBlog(Integer id) {
        if (blogRepository.existsById(id)) {
            blogRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private BlogDTO convertToDto(Blog blog) {
        BlogDTO dto = new BlogDTO();
        BeanUtils.copyProperties(blog, dto);
        dto.setUserId(blog.getUser() != null ? blog.getUser().getUserId() : null);
        dto.setPlaceId(blog.getPlaceId()); // Set the place ID

        // Fetch place title from content-service for display
        if (blog.getPlaceId() != null) {
            try {
                PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(blog.getPlaceId());
                if (placeDetails != null) {
                    dto.setPlaceTitle(placeDetails.getTitle());
                }
            } catch (Exception e) {
                System.err.println("Could not fetch place title for blog " + blog.getBlogId() + ": " + e.getMessage());
                dto.setPlaceTitle("N/A (Place Service Error)"); // Fallback
            }
        }
        return dto;
    }
}
