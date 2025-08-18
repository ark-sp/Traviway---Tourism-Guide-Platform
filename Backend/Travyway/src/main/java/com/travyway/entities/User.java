package com.travyway.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
@Entity
@Table(name = "users")
@Data
public class User{

	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "user_id") // Matches column name in SQL schema
	    private Integer userId;

	    @Column(nullable = false, length = 100, unique = true)
	    private String username;

	    @Column(nullable = false, length = 255, unique = true)
	    private String email;

	    @Column(name = "password_hash", nullable = false, length = 255) // Matches column name in SQL schema
	    private String passwordHash;

	    @Column(nullable = false, length = 255, columnDefinition = "varchar(255) default 'user'")
	    private String role; // 'user' or 'admin'

	    @Column(name = "created_at", columnDefinition = "DATE DEFAULT CURRENT_TIMESTAMP")
	    private LocalDate createdAt; // Changed to LocalDate as per SQL dump

	    @Column(name = "user_name", length = 255) // Matches column name in SQL schema (might be redundant with 'username')
	    private String userName; // Note: SQL schema has both 'username' and 'user_name'

	    // Relationships (assuming these entities would exist in other services or be accessible)
	    // One-to-many relationship with Blogs
	    // Note: If Blog is in a separate service, this relationship might be managed differently (e.g., via DTOs or eventual consistency)
	    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<Blog> blogs;

	    // One-to-many relationship with Reviews
	    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<Review> reviews;

	    // One-to-many relationship with VisitedPlace
	    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<VisitedPlace> visitedPlaces;

	    // One-to-many relationship with Wishlist
	    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<WishList> wishlists;

	    @PrePersist
	    protected void onCreate() {
	        if (createdAt == null) {
	            createdAt = LocalDate.now();
	        }
	        if (role == null) {
	            role = "user"; // Default role if not set
	        }
	    }
	
}
