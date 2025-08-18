package com.travyway.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travyway.entities.User;
import com.travyway.entities.WishList;
import com.travyway.entities.dto.PlaceDetailDTO;
import com.travyway.entities.dto.WishListDTO;
import com.travyway.exception.ResourceNotFoundException;
import com.travyway.feignclientservices.ContentServiceClient;
import com.travyway.repositories.UserRepository;
import com.travyway.repositories.WishListRepository;

import feign.FeignException;
import jakarta.transaction.Transactional;

@Service
public class WishListService {

    @Autowired
    private WishListRepository wishlistRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContentServiceClient contentServiceClient;

    public List<WishListDTO> getAllWishlists() {
        return wishlistRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<WishListDTO> getWishlistById(Integer id) {
        return wishlistRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<WishListDTO> getWishlistsByUserId(Integer userId) {
        return wishlistRepository.findByUserUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishListDTO addPlaceToWishlist(WishListDTO wishlistDTO) {
        User user = userRepository.findById(wishlistDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + wishlistDTO.getUserId()));

        // Check if place is already in wishlist for this user
        if (wishlistRepository.findByUser_UserIdAndPlaceId(wishlistDTO.getUserId(), wishlistDTO.getPlaceId()).isPresent()) {
            throw new IllegalArgumentException("Place is already in the wishlist for this user.");
        }

        // Validate that the place exists by calling the content-service
        try {
            PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(wishlistDTO.getPlaceId());
            if (placeDetails == null || placeDetails.getPlaceId() == null) {
                 throw new ResourceNotFoundException("Place not found in content-service with id: " + wishlistDTO.getPlaceId());
            }
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Place not found in content-service with id: " + wishlistDTO.getPlaceId());
        }

        WishList wishlist = new WishList();
        BeanUtils.copyProperties(wishlistDTO, wishlist, "wishlistId", "userId", "placeTitle");
        wishlist.setUser(user);
        wishlist.setPlaceId(wishlistDTO.getPlaceId());
        return convertToDto(wishlistRepository.save(wishlist));
    }

    @Transactional
    public boolean removePlaceFromWishlist(Integer id) {
        if (wishlistRepository.existsById(id)) {
            wishlistRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private WishListDTO convertToDto(WishList wishlist) {
        WishListDTO dto = new WishListDTO();
        BeanUtils.copyProperties(wishlist, dto);
        dto.setUserId(wishlist.getUser() != null ? wishlist.getUser().getUserId() : null);
        dto.setPlaceId(wishlist.getPlaceId());

        if (wishlist.getPlaceId() != null) {
            try {
                PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(wishlist.getPlaceId());
                if (placeDetails != null) {
                    dto.setPlaceTitle(placeDetails.getTitle());
                }
            } catch (Exception e) {
                System.err.println("Could not fetch place title for wishlist item " + wishlist.getWishlistId() + ": " + e.getMessage());
                dto.setPlaceTitle("N/A (Place Service Error)");
            }
        }
        return dto;
    }

}
