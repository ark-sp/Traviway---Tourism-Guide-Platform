package com.contentservice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.contentservice.entities.Category;
import com.contentservice.entities.dto.CategoryDTO;
import com.contentservice.repositories.CategoryRepository;

import jakarta.transaction.Transactional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CategoryDTO> getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .map(this::convertToDto);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category, "categoryId");
        return convertToDto(categoryRepository.save(category));
    }

    @Transactional
    public Optional<CategoryDTO> updateCategory(Integer id, CategoryDTO categoryDTO) {
        return categoryRepository.findById(id)
                .map(existingCategory -> {
                    BeanUtils.copyProperties(categoryDTO, existingCategory, "categoryId");
                    return convertToDto(categoryRepository.save(existingCategory));
                });
    }

    @Transactional
    public boolean deleteCategory(Integer id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public CategoryDTO convertToDto(Category category) {
        CategoryDTO dto = new CategoryDTO();
        BeanUtils.copyProperties(category, dto);
        return dto;
    }
}