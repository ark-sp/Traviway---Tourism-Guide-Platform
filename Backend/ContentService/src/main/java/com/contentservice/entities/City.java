package com.contentservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "cities")
@Data
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Integer cityId;

    @Column(name = "city_name", nullable = false, unique = true)
    private String cityName;

    @Column(name="city_image")
    private String cityImage;

    // --- Add these fields ---
    @Column(name="latitude")
    private Double latitude;

    @Column(name="longitude")
    private Double longitude;
    // --- End add ---

    @JsonIgnore
    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Place> places;

    @JsonIgnore
    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LocalFood> localFoods;
}
