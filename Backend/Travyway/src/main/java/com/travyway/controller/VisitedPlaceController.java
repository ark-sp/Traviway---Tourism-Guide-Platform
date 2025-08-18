package com.travyway.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travyway.entities.dto.VisitedPlaceDTO;
import com.travyway.services.VisitedPlaceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/travyway/visited-places")
public class VisitedPlaceController {

    private final VisitedPlaceService visitedPlaceService;

    public VisitedPlaceController(VisitedPlaceService visitedPlaceService) {
        this.visitedPlaceService = visitedPlaceService;
    }

    @GetMapping
    public ResponseEntity<List<VisitedPlaceDTO>> getAllVisitedPlaces() {
        List<VisitedPlaceDTO> visitedPlaces = visitedPlaceService.getAllVisitedPlaces();
        return ResponseEntity.ok(visitedPlaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitedPlaceDTO> getVisitedPlaceById(@PathVariable Integer id) {
        return visitedPlaceService.getVisitedPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<VisitedPlaceDTO>> getVisitedPlacesByUserId(@PathVariable Integer userId) {
        List<VisitedPlaceDTO> visitedPlaces = visitedPlaceService.getVisitedPlacesByUserId(userId);
        if (visitedPlaces.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(visitedPlaces);
    }

    @PostMapping
    public ResponseEntity<VisitedPlaceDTO> addVisitedPlace(@Valid @RequestBody VisitedPlaceDTO visitedPlaceDTO) {
        VisitedPlaceDTO createdVisitedPlace = visitedPlaceService.addVisitedPlace(visitedPlaceDTO);
        return new ResponseEntity<>(createdVisitedPlace, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisitedPlace(@PathVariable Integer id) {
        if (visitedPlaceService.deleteVisitedPlace(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
