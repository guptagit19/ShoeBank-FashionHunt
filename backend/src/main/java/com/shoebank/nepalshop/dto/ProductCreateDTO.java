package com.shoebank.nepalshop.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCreateDTO {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;
    
    private BigDecimal discountPrice;
    
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    private List<String> images;
    
    private String size;
    
    private String color;
    
    private String brand;
    
    private String gender;
    
    private String material;
    
    private String weight;
    
    private String occasion;
    
    private List<String> tags;
    
    private Boolean isAvailable = true;
    
    private Boolean isFeatured = false;
}
