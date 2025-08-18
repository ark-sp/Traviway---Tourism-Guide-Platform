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

import com.travyway.entities.dto.WishListDTO;
import com.travyway.services.WishListService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/travyway/wishlists")
public class WishListController {

    private final WishListService wishlistService;

    public WishListController(WishListService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<WishListDTO>> getAllWishlists() {
        List<WishListDTO> wishlists = wishlistService.getAllWishlists();
        return ResponseEntity.ok(wishlists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WishListDTO> getWishlistById(@PathVariable Integer id) {
        return wishlistService.getWishlistById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<WishListDTO>> getWishlistsByUserId(@PathVariable Integer userId) {
        List<WishListDTO> wishlists = wishlistService.getWishlistsByUserId(userId);
        if (wishlists.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wishlists);
    }

    @PostMapping
    public ResponseEntity<WishListDTO> addPlaceToWishlist(@Valid @RequestBody WishListDTO wishlistDTO) {
        WishListDTO createdWishlist = wishlistService.addPlaceToWishlist(wishlistDTO);
        return new ResponseEntity<>(createdWishlist, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removePlaceFromWishlist(@PathVariable Integer id) {
        if (wishlistService.removePlaceFromWishlist(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
