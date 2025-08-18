package com.contentservice.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "places")
@Data
public class Place {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "place_id")
	private Integer placeId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "city_id")
	private City city;

	@Column(nullable = false, length = 200)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(name = "how_to_reach", columnDefinition = "TEXT")
	private String howToReach;

	@Column(name = "created_at", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime createdAt;

	@OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PlaceImage> placeImages;
	
	@Column(name="latitude")
	private Double latitude;

	@Column(name="longitude")
	private Double longitude;


	// These relationships are commented out because Review, Blog, VisitedPlace,
	// Wishlist
	// entities will be in other services. In a true microservice setup, you'd store
	// just the IDs here and fetch related data via API calls.
	// @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval =
	// true)
	// private List<Review> reviews;
	// @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval =
	// true)
	// private List<Blog> blogs;
	// @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval =
	// true)
	// private List<VisitedPlace> visitedPlaces;
	// @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval =
	// true)
	// private List<Wishlist> wishlists;

	@PrePersist
	protected void onCreate() {
		if (createdAt == null) {
			createdAt = LocalDateTime.now();
		}
	}
}
