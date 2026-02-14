package com.shoebank.nepalshop.service;

import com.shoebank.nepalshop.dto.CategoryDTO;
import com.shoebank.nepalshop.model.Category;
import com.shoebank.nepalshop.repository.CategoryRepository;
import com.shoebank.nepalshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    public List<CategoryDTO> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToDTO(category);
    }
    
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToDTO(category);
    }
    
    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new RuntimeException("Category with this slug already exists");
        }
        
        Category category = Category.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .image(dto.getImage())
                .displayOrder(dto.getDisplayOrder())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        
        return convertToDTO(categoryRepository.save(category));
    }
    
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setImage(dto.getImage());
        category.setDisplayOrder(dto.getDisplayOrder());
        category.setIsActive(dto.getIsActive());
        
        return convertToDTO(categoryRepository.save(category));
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new RuntimeException("Cannot delete category with products. Remove products first.");
        }
        categoryRepository.deleteById(id);
    }
    
    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .image(category.getImage())
                .displayOrder(category.getDisplayOrder())
                .isActive(category.getIsActive())
                .productCount(productRepository.countByCategoryId(category.getId()))
                .build();
    }
}
