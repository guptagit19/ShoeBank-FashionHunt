package com.shoebank.nepalshop.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity = 1;
    
    private String selectedSize;
    
    private String selectedColor;
    
    private String specialInstructions; // For food orders
    
    public BigDecimal getSubtotal() {
        BigDecimal price = product.getDiscountPrice() != null ? 
            product.getDiscountPrice() : product.getPrice();
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
