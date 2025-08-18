package com.contentservice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.contentservice.entities.City;
import com.contentservice.entities.dto.CityDTO;
import com.contentservice.repositories.CityRepository;

import jakarta.transaction.Transactional;

@Service
public class CityService {

	@Autowired
	private CityRepository cityRepository;
	
	@Autowired
	private PlaceService placeService;
	
	@Autowired
	private LocalFoodService localFoodService;
	
	 public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CityDTO> getCityById(Integer id) {
        return cityRepository.findById(id)
                .map(this::convertToDto);
    }

    @Transactional
    public CityDTO createCity(CityDTO cityDTO) {
        City city = new City();
        BeanUtils.copyProperties(cityDTO, city, "cityId", "places", "localFoods");
        return convertToDto(cityRepository.save(city));
    }

    @Transactional
    public Optional<CityDTO> updateCity(Integer id, CityDTO cityDTO) {
        return cityRepository.findById(id)
                .map(existingCity -> {
                    BeanUtils.copyProperties(cityDTO, existingCity, "cityId", "places", "localFoods");
                    return convertToDto(cityRepository.save(existingCity));
                });
    }

    @Transactional
    public boolean deleteCity(Integer id) {
        if (cityRepository.existsById(id)) {
            cityRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private CityDTO convertToDto(City city) {
        CityDTO dto = new CityDTO();
        BeanUtils.copyProperties(city, dto);
        if (city.getPlaces() != null) {
            dto.setPlaces(city.getPlaces().stream()
                    .map(placeService::convertToDto)
                    .collect(Collectors.toList()));
        }
        if (city.getLocalFoods() != null) {
            dto.setLocalFoods(city.getLocalFoods().stream()
                    .map(localFoodService::convertToDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public CityDTO convertToDtoWithoutNested(City city) {
        CityDTO dto = new CityDTO();
        BeanUtils.copyProperties(city, dto, "places", "localFoods");
        return dto;
    }
	
	
}