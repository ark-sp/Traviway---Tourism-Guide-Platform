
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.contentservice.entities.dto.PlaceDTO;
import com.contentservice.service.PlaceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/content/places")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @GetMapping
    public ResponseEntity<List<PlaceDTO>> getAllPlaces(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer cityId,
            @RequestParam(required = false) Integer categoryId) {

        boolean isSearchQueryPresent = 
            (title != null && !title.trim().isEmpty()) || cityId != null || categoryId != null;

        List<PlaceDTO> places;

        if (isSearchQueryPresent) {
            places = placeService.searchPlaces(title, cityId, categoryId);
        } else {
            places = placeService.getAllPlaces();
        }

        return ResponseEntity.ok(places);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PlaceDTO> getPlaceById(@PathVariable Integer id) {
        return placeService.getPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-city/{cityId}")
    public ResponseEntity<List<PlaceDTO>> getPlacesByCityId(@PathVariable Integer cityId) {
        List<PlaceDTO> places = placeService.getPlacesByCityId(cityId);
        if (places.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(places);
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<PlaceDTO>> getPlacesByCategoryId(@PathVariable Integer categoryId) {
        List<PlaceDTO> places = placeService.getPlacesByCategoryId(categoryId);
        if (places.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(places);
    }

    @PostMapping
    public ResponseEntity<PlaceDTO> createPlace(@Valid @RequestBody PlaceDTO placeDTO) {
        return placeService.createPlace(placeDTO)
                .map(createdPlace -> new ResponseEntity<>(createdPlace, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlaceDTO> updatePlace(@PathVariable Integer id, @Valid @RequestBody PlaceDTO placeDTO) {
        return placeService.updatePlace(id, placeDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Integer id) {
        if (placeService.deletePlace(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}