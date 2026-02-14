package com.shoebank.nepalshop.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_tracking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryTracking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.ORDER_PLACED;
    
    @Column(name = "status_message")
    private String statusMessage;
    
    @Column(name = "delivery_person_name")
    private String deliveryPersonName;
    
    @Column(name = "delivery_person_phone")
    private String deliveryPersonPhone;
    
    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;
    
    @Column(name = "actual_delivery_time")
    private LocalDateTime actualDeliveryTime;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
    
    public enum DeliveryStatus {
        ORDER_PLACED("Order Placed"),
        CONFIRMED("Order Confirmed"),
        PREPARING("Preparing your order"),
        READY("Ready for pickup"),
        OUT_FOR_DELIVERY("Out for delivery"),
        DELIVERED("Delivered"),
        CANCELLED("Cancelled");
        
        private final String displayName;
        
        DeliveryStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}
