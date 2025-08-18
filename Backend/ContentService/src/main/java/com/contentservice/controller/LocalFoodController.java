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

import com.contentservice.entities.dto.LocalFoodDTO;
import com.contentservice.service.LocalFoodService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/content/local-foods")
public class LocalFoodController {

     @Autowired
    private LocalFoodService localFoodService;

    @GetMapping
    public ResponseEntity<List<LocalFoodDTO>> getAllLocalFoods() {
        List<LocalFoodDTO> foods = localFoodService.getAllLocalFoods();
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalFoodDTO> getLocalFoodById(@PathVariable Integer id) {
        return localFoodService.getLocalFoodById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-city/{cityId}")
    public ResponseEntity<List<LocalFoodDTO>> getLocalFoodsByCityId(@PathVariable Integer cityId) {
        List<LocalFoodDTO> foods = localFoodService.getLocalFoodsByCityId(cityId);
        if (foods.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(foods);
    }


    @PostMapping
    public ResponseEntity<LocalFoodDTO> createLocalFood(@Valid @RequestBody LocalFoodDTO localFoodDTO) {
        if (localFoodDTO.getCityId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return localFoodService.createLocalFood(localFoodDTO)
                .map(createdFood -> new ResponseEntity<>(createdFood, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocalFoodDTO> updateLocalFood(@PathVariable Integer id, @Valid @RequestBody LocalFoodDTO localFoodDTO) {
        if (localFoodDTO.getCityId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return localFoodService.updateLocalFood(id, localFoodDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocalFood(@PathVariable Integer id) {
        if (localFoodService.deleteLocalFood(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
