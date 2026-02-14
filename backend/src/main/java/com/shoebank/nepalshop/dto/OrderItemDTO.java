package com.shoebank.nepalshop.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private Integer quantity;
    private String selectedSize;
    private String selectedColor;
    private String specialInstructions;
    private BigDecimal subtotal;
}
