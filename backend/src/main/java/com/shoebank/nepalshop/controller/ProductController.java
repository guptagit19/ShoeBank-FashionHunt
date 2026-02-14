package com.shoebank.nepalshop.controller;

import com.shoebank.nepalshop.dto.ApiResponse;
import com.shoebank.nepalshop.dto.ProductDTO;
import com.shoebank.nepalshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String tag) {

        Page<ProductDTO> products = productService.getProducts(
                categoryId, search, page, size, sortBy, sortDir,
                minPrice, maxPrice, brand, gender, occasion, tag);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getFeaturedProducts() {
        List<ProductDTO> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success(product));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
