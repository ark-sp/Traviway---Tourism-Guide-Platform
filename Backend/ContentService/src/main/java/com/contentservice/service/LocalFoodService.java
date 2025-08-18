package com.contentservice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.contentservice.entities.LocalFood;
import com.contentservice.entities.dto.LocalFoodDTO;
import com.contentservice.repositories.CityRepository;
import com.contentservice.repositories.LocalFoodRepository;

import jakarta.transaction.Transactional;

@Service
public class LocalFoodService {

   @Autowired
    private LocalFoodRepository localFoodRepository;
    @Autowired
    private CityRepository cityRepository;

    public List<LocalFoodDTO> getAllLocalFoods() {
        return localFoodRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<LocalFoodDTO> getLocalFoodById(Integer id) {
        return localFoodRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<LocalFoodDTO> getLocalFoodsByCityId(Integer cityId) {
        return localFoodRepository.findByCityCityId(cityId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<LocalFoodDTO> createLocalFood(LocalFoodDTO localFoodDTO) {
        return cityRepository.findById(localFoodDTO.getCityId())
                .map(city -> {
                    LocalFood localFood = new LocalFood();
                    BeanUtils.copyProperties(localFoodDTO, localFood, "foodId", "cityId");
                    localFood.setCity(city);
                    return convertToDto(localFoodRepository.save(localFood));
                });
    }

    @Transactional
    public Optional<LocalFoodDTO> updateLocalFood(Integer id, LocalFoodDTO localFoodDTO) {
        return localFoodRepository.findById(id)
                .flatMap(existingFood -> cityRepository.findById(localFoodDTO.getCityId())
                        .map(city -> {
                            BeanUtils.copyProperties(localFoodDTO, existingFood, "foodId", "cityId");
                            existingFood.setCity(city);
                            return convertToDto(localFoodRepository.save(existingFood));
                        }));
    }

    @Transactional
    public boolean deleteLocalFood(Integer id) {
        if (localFoodRepository.existsById(id)) {
            localFoodRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public LocalFoodDTO convertToDto(LocalFood localFood) {
        LocalFoodDTO dto = new LocalFoodDTO();
        BeanUtils.copyProperties(localFood, dto);
        dto.setCityId(localFood.getCity() != null ? localFood.getCity().getCityId() : null);
        return dto;
    }
}
