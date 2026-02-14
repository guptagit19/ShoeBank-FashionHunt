package com.shoebank.nepalshop.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private List<String> images;
    private String size;
    private String color;
    private String brand;
    private String gender;
    private String material;
    private String weight;
    private String occasion;
    private List<String> tags;
    private Boolean isAvailable;
    private Boolean isFeatured;
}
