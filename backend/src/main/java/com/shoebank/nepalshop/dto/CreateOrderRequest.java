package com.shoebank.nepalshop.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    private String customerEmail;
    
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String customerPhone;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    private String deliveryCity;
    
    private String deliveryNotes;
    
    @NotBlank(message = "Session ID is required")
    private String sessionId;
    
    private String paymentMethod = "ESEWA";
}
