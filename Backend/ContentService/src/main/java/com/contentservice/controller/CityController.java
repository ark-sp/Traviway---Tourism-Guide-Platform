package com.contentservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.contentservice.entities.dto.CityDTO;
import com.contentservice.service.CityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/content/cities")
public class CityController {

    @Autowired
    private CityService cityService;

    @GetMapping
    public ResponseEntity<List<CityDTO>> getAllCities() {
        List<CityDTO> cities = cityService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CityDTO> getCityById(@PathVariable Integer id) {
        return cityService.getCityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CityDTO> createCity(@Valid @RequestBody CityDTO cityDTO) {
        CityDTO createdCity = cityService.createCity(cityDTO);
        return new ResponseEntity<>(createdCity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CityDTO> updateCity(@PathVariable Integer id, @Valid @RequestBody CityDTO cityDTO) {
        return cityService.updateCity(id, cityDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Integer id) {
        if (cityService.deleteCity(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
