package com.contentservice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.contentservice.entities.Category;
import com.contentservice.entities.City;
import com.contentservice.entities.Place;
import com.contentservice.entities.dto.PlaceDTO;
import com.contentservice.repositories.CategoryRepository;
import com.contentservice.repositories.CityRepository;
import com.contentservice.repositories.PlaceRepository;

import jakarta.transaction.Transactional;

@Service
public class PlaceService {

    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private PlaceImageService placeImageService;

    public List<PlaceDTO> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<PlaceDTO> getPlaceById(Integer id) {
        return placeRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<PlaceDTO> getPlacesByCityId(Integer cityId) {
        return placeRepository.findByCityCityId(cityId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PlaceDTO> getPlacesByCategoryId(Integer categoryId) {
        return placeRepository.findByCategoryCategoryId(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // New method to implement search functionality
    public List<PlaceDTO> searchPlaces(String title, Integer cityId, Integer categoryId) {
        return placeRepository.searchPlaces(title, cityId, categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public Optional<PlaceDTO> createPlace(PlaceDTO placeDTO) {
        Optional<Category> categoryOptional = categoryRepository.findById(placeDTO.getCategoryId());
        Optional<City> cityOptional = cityRepository.findById(placeDTO.getCityId());

        if (categoryOptional.isEmpty() || cityOptional.isEmpty()) {
            return Optional.empty();
        }

        Place place = new Place();
        BeanUtils.copyProperties(placeDTO, place, "placeId", "categoryId", "cityId", "placeImages");
        place.setCategory(categoryOptional.get());
        place.setCity(cityOptional.get());
        Place savedPlace = placeRepository.save(place);

        if (placeDTO.getPlaceImages() != null && !placeDTO.getPlaceImages().isEmpty()) {
            placeDTO.getPlaceImages().forEach(imgDto -> {
                imgDto.setPlaceId(savedPlace.getPlaceId());
                placeImageService.createPlaceImage(imgDto);
            });
        }

        return Optional.of(convertToDto(savedPlace));
    }

    @Transactional
    public Optional<PlaceDTO> updatePlace(Integer id, PlaceDTO placeDTO) {
        return placeRepository.findById(id)
                .flatMap(existingPlace -> {
                    Optional<Category> categoryOptional = categoryRepository.findById(placeDTO.getCategoryId());
                    Optional<City> cityOptional = cityRepository.findById(placeDTO.getCityId());

                    if (categoryOptional.isEmpty() || cityOptional.isEmpty()) {
                        return Optional.empty();
                    }

                    BeanUtils.copyProperties(placeDTO, existingPlace, "placeId", "categoryId", "cityId", "placeImages", "createdAt");
                    existingPlace.setCategory(categoryOptional.get());
                    existingPlace.setCity(cityOptional.get());
                    Place updatedPlace = placeRepository.save(existingPlace);

                    placeImageService.deleteImagesByPlaceId(updatedPlace.getPlaceId());
                    if (placeDTO.getPlaceImages() != null && !placeDTO.getPlaceImages().isEmpty()) {
                        placeDTO.getPlaceImages().forEach(imgDto -> {
                            imgDto.setPlaceId(updatedPlace.getPlaceId());
                            placeImageService.createPlaceImage(imgDto);
                        });
                    }

                    return Optional.of(convertToDto(updatedPlace));
                });
    }

    @Transactional
    public boolean deletePlace(Integer id) {
        if (placeRepository.existsById(id)) {
            placeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public PlaceDTO convertToDto(Place place) {
        PlaceDTO dto = new PlaceDTO();
        BeanUtils.copyProperties(place, dto);
        dto.setCategoryId(place.getCategory() != null ? place.getCategory().getCategoryId() : null);
        dto.setCityId(place.getCity() != null ? place.getCity().getCityId() : null);
        if (place.getPlaceImages() != null) {
            dto.setPlaceImages(place.getPlaceImages().stream()
                    .map(placeImageService::convertToDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}