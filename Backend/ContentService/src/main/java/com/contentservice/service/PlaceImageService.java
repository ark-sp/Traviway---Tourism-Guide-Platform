package com.contentservice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.contentservice.entities.PlaceImage;
import com.contentservice.entities.dto.PlaceImageDTO;
import com.contentservice.repositories.PlaceImageRepository;
import com.contentservice.repositories.PlaceRepository;

import jakarta.transaction.Transactional;

@Service
public class PlaceImageService {

    @Autowired
    private PlaceImageRepository placeImageRepository;
    @Autowired
    private PlaceRepository placeRepository;

    public List<PlaceImageDTO> getAllPlaceImages() {
        return placeImageRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<PlaceImageDTO> getPlaceImageById(Integer id) {
        return placeImageRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<PlaceImageDTO> getPlaceImagesByPlaceId(Integer placeId) {
        return placeImageRepository.findByPlacePlaceId(placeId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<PlaceImageDTO> createPlaceImage(PlaceImageDTO placeImageDTO) {
        return placeRepository.findById(placeImageDTO.getPlaceId())
                .map(place -> {
                    PlaceImage placeImage = new PlaceImage();
                    BeanUtils.copyProperties(placeImageDTO, placeImage, "imageId", "placeId");
                    placeImage.setPlace(place);
                    return convertToDto(placeImageRepository.save(placeImage));
                });
    }

    @Transactional
    public Optional<PlaceImageDTO> updatePlaceImage(Integer id, PlaceImageDTO placeImageDTO) {
        return placeImageRepository.findById(id)
                .flatMap(existingImage -> placeRepository.findById(placeImageDTO.getPlaceId())
                        .map(place -> {
                            BeanUtils.copyProperties(placeImageDTO, existingImage, "imageId", "placeId");
                            existingImage.setPlace(place);
                            return convertToDto(placeImageRepository.save(existingImage));
                        }));
    }

    @Transactional
    public boolean deletePlaceImage(Integer id) {
        if (placeImageRepository.existsById(id)) {
            placeImageRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public void deleteImagesByPlaceId(Integer placeId) {
        List<PlaceImage> imagesToDelete = placeImageRepository.findByPlacePlaceId(placeId);
        placeImageRepository.deleteAll(imagesToDelete);
    }

    public PlaceImageDTO convertToDto(PlaceImage placeImage) {
        PlaceImageDTO dto = new PlaceImageDTO();
        BeanUtils.copyProperties(placeImage, dto);
        dto.setPlaceId(placeImage.getPlace() != null ? placeImage.getPlace().getPlaceId() : null);
        return dto;
    }
}
