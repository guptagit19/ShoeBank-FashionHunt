package com.shoebank.nepalshop.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryNotes;
    private List<OrderItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String paymentMethod;
    private String orderStatus;
    private String orderType;
    private DeliveryTrackingDTO deliveryTracking;
    private LocalDateTime createdAt;
}
