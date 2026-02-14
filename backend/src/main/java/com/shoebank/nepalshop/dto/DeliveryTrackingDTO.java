package com.shoebank.nepalshop.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryTrackingDTO {
    private Long id;
    private String orderNumber;
    private String status;
    private String statusDisplayName;
    private String statusMessage;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime lastUpdated;
}
