package com.travyway.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travyway.entities.User;
import com.travyway.entities.VisitedPlace;
import com.travyway.entities.dto.PlaceDetailDTO;
import com.travyway.entities.dto.VisitedPlaceDTO;
import com.travyway.exception.ResourceNotFoundException;
import com.travyway.feignclientservices.ContentServiceClient;
import com.travyway.repositories.UserRepository;
import com.travyway.repositories.VisitedPlaceRepository;

import feign.FeignException;
import jakarta.transaction.Transactional;

@Service
public class VisitedPlaceService {

    @Autowired
    private VisitedPlaceRepository visitedPlaceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContentServiceClient contentServiceClient;

    public List<VisitedPlaceDTO> getAllVisitedPlaces() {
        return visitedPlaceRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<VisitedPlaceDTO> getVisitedPlaceById(Integer id) {
        return visitedPlaceRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<VisitedPlaceDTO> getVisitedPlacesByUserId(Integer userId) {
        return visitedPlaceRepository.findByUserUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VisitedPlaceDTO addVisitedPlace(VisitedPlaceDTO visitedPlaceDTO) {
        User user = userRepository.findById(visitedPlaceDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + visitedPlaceDTO.getUserId()));

        // Check if user has already marked this place as visited
        if (visitedPlaceRepository.findByUser_UserIdAndPlaceId(visitedPlaceDTO.getUserId(), visitedPlaceDTO.getPlaceId()).isPresent()) {
            throw new IllegalArgumentException("User has already marked this place as visited.");
        }

        // Validate that the place exists by calling the content-service
        try {
            PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(visitedPlaceDTO.getPlaceId());
            if (placeDetails == null || placeDetails.getPlaceId() == null) {
                 throw new ResourceNotFoundException("Place not found in content-service with id: " + visitedPlaceDTO.getPlaceId());
            }
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Place not found in content-service with id: " + visitedPlaceDTO.getPlaceId());
        }

        VisitedPlace visitedPlace = new VisitedPlace();
        BeanUtils.copyProperties(visitedPlaceDTO, visitedPlace, "visitId", "userId", "placeTitle");
        visitedPlace.setUser(user);
        visitedPlace.setPlaceId(visitedPlaceDTO.getPlaceId());
        return convertToDto(visitedPlaceRepository.save(visitedPlace));
    }

    @Transactional
    public boolean deleteVisitedPlace(Integer id) {
        if (visitedPlaceRepository.existsById(id)) {
            visitedPlaceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private VisitedPlaceDTO convertToDto(VisitedPlace visitedPlace) {
        VisitedPlaceDTO dto = new VisitedPlaceDTO();
        BeanUtils.copyProperties(visitedPlace, dto);
        dto.setUserId(visitedPlace.getUser() != null ? visitedPlace.getUser().getUserId() : null);
        dto.setPlaceId(visitedPlace.getPlaceId());

        if (visitedPlace.getPlaceId() != null) {
            try {
                PlaceDetailDTO placeDetails = contentServiceClient.getPlaceById(visitedPlace.getPlaceId());
                if (placeDetails != null) {
                    dto.setPlaceTitle(placeDetails.getTitle());
                }
            } catch (Exception e) {
                System.err.println("Could not fetch place title for visited place " + visitedPlace.getVisitId() + ": " + e.getMessage());
                dto.setPlaceTitle("N/A (Place Service Error)");
            }
        }
        return dto;
    }
}
