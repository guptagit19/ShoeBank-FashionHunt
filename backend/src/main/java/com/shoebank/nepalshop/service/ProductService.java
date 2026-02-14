package com.shoebank.nepalshop.service;

import com.shoebank.nepalshop.dto.ProductCreateDTO;
import com.shoebank.nepalshop.dto.ProductDTO;
import com.shoebank.nepalshop.model.Category;
import com.shoebank.nepalshop.model.Product;
import com.shoebank.nepalshop.repository.CategoryRepository;
import com.shoebank.nepalshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDTO> getProducts(Long categoryId, String search, int page, int size,
                                         String sortBy, String sortDir,
                                         BigDecimal minPrice, BigDecimal maxPrice,
                                         String brand, String gender,
                                         String occasion, String tag) {
        // Parse sort field and direction
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortField = sortBy != null ? sortBy : "createdAt";
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        // Normalize empty strings to null for JPQL null-checks
        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String brandParam = (brand != null && !brand.trim().isEmpty()) ? brand.trim() : null;
        String genderParam = (gender != null && !gender.trim().isEmpty()) ? gender.trim() : null;
        String occasionParam = (occasion != null && !occasion.trim().isEmpty()) ? occasion.trim() : null;
        String tagParam = (tag != null && !tag.trim().isEmpty()) ? tag.trim() : null;

        Page<Product> products = productRepository.findByFilters(
                categoryId, searchTerm, minPrice, maxPrice,
                brandParam, genderParam, occasionParam, tagParam,
                pageable);

        return products.map(this::convertToDTO);
    }

    // Backward-compatible overload for admin/internal calls
    public Page<ProductDTO> getProducts(Long categoryId, String search, int page, int size, String sortBy) {
        return getProducts(categoryId, search, page, size, sortBy, "desc", null, null, null, null, null, null);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsAvailableTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .discountPrice(dto.getDiscountPrice())
                .stock(dto.getStock())
                .category(category)
                .images(dto.getImages())
                .size(dto.getSize())
                .color(dto.getColor())
                .brand(dto.getBrand())
                .gender(dto.getGender())
                .material(dto.getMaterial())
                .weight(dto.getWeight())
                .occasion(dto.getOccasion())
                .tags(dto.getTags() != null ? dto.getTags() : new ArrayList<>())
                .isAvailable(dto.getIsAvailable())
                .isFeatured(dto.getIsFeatured())
                .build();

        return convertToDTO(productRepository.save(product));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setStock(dto.getStock());
        product.setImages(dto.getImages());
        product.setSize(dto.getSize());
        product.setColor(dto.getColor());
        product.setBrand(dto.getBrand());
        product.setGender(dto.getGender());
        product.setMaterial(dto.getMaterial());
        product.setWeight(dto.getWeight());
        product.setOccasion(dto.getOccasion());
        product.setTags(dto.getTags() != null ? dto.getTags() : new ArrayList<>());
        product.setIsAvailable(dto.getIsAvailable());
        product.setIsFeatured(dto.getIsFeatured());

        return convertToDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void updateStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int newStock = product.getStock() - quantity;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock");
        }
        product.setStock(newStock);
        productRepository.save(product);
    }

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .stock(product.getStock())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .categorySlug(product.getCategory().getSlug())
                .images(product.getImages() != null ? product.getImages().stream()
                        .map(img -> {
                            // Cloudinary URLs are absolute — return as-is
                            if (img != null && (img.startsWith("http://") || img.startsWith("https://"))) {
                                return img;
                            }
                            // Legacy local uploads — normalize path
                            if (img != null && img.contains("/uploads/")) {
                                return "/uploads/" + img.substring(img.lastIndexOf("/uploads/") + 9);
                            }
                            return img;
                        })
                        .collect(Collectors.toList()) : new ArrayList<>())
                .size(product.getSize())
                .color(product.getColor())
                .brand(product.getBrand())
                .gender(product.getGender())
                .material(product.getMaterial())
                .weight(product.getWeight())
                .occasion(product.getOccasion())
                .tags(product.getTags() != null ? product.getTags() : new ArrayList<>())
                .isAvailable(product.getIsAvailable())
                .isFeatured(product.getIsFeatured())
                .build();
    }
}
