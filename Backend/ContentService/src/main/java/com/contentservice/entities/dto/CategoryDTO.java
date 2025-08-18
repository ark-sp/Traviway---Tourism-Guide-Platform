package com.contentservice.entities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryDTO {

	    private Integer categoryId;

	    @NotBlank(message = "Category name cannot be empty")
	    @Size(max = 100, message = "Category name must be less than 100 characters")
	    private String categoryName;
	

}
