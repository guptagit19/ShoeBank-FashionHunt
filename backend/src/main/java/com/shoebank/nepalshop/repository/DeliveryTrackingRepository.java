package com.shoebank.nepalshop.repository;

import com.shoebank.nepalshop.model.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {
    Optional<DeliveryTracking> findByOrderId(Long orderId);
    Optional<DeliveryTracking> findByOrderOrderNumber(String orderNumber);
}
