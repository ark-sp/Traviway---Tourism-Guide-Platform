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

import com.contentservice.entities.dto.PlaceImageDTO;
import com.contentservice.service.PlaceImageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/content/place-images")
public class PlaceImageController {

    @Autowired
    private PlaceImageService placeImageService;

    @GetMapping
    public ResponseEntity<List<PlaceImageDTO>> getAllPlaceImages() {
        List<PlaceImageDTO> images = placeImageService.getAllPlaceImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceImageDTO> getPlaceImageById(@PathVariable Integer id) {
        return placeImageService.getPlaceImageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-place/{placeId}")
    public ResponseEntity<List<PlaceImageDTO>> getPlaceImagesByPlaceId(@PathVariable Integer placeId) {
        List<PlaceImageDTO> images = placeImageService.getPlaceImagesByPlaceId(placeId);
        if (images.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(images);
    }

    @PostMapping
    public ResponseEntity<PlaceImageDTO> createPlaceImage(@Valid @RequestBody PlaceImageDTO placeImageDTO) {
        return placeImageService.createPlaceImage(placeImageDTO)
                .map(createdImage -> new ResponseEntity<>(createdImage, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlaceImageDTO> updatePlaceImage(@PathVariable Integer id, @Valid @RequestBody PlaceImageDTO placeImageDTO) {
        return placeImageService.updatePlaceImage(id, placeImageDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaceImage(@PathVariable Integer id) {
        if (placeImageService.deletePlaceImage(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
