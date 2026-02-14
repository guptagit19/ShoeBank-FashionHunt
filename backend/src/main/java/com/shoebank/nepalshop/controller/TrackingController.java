package com.shoebank.nepalshop.controller;

import com.shoebank.nepalshop.dto.ApiResponse;
import com.shoebank.nepalshop.dto.DeliveryTrackingDTO;
import com.shoebank.nepalshop.model.DeliveryTracking;
import com.shoebank.nepalshop.repository.DeliveryTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@CrossOrigin
public class TrackingController {

    private final DeliveryTrackingRepository trackingRepository;

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<DeliveryTrackingDTO>> getTracking(@PathVariable String orderNumber) {
        DeliveryTracking tracking = trackingRepository.findByOrderOrderNumber(orderNumber)
                .orElse(null);

        if (tracking == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Tracking not found for this order"));
        }

        DeliveryTrackingDTO dto = DeliveryTrackingDTO.builder()
                .id(tracking.getId())
                .orderNumber(orderNumber)
                .status(tracking.getStatus().name())
                .statusDisplayName(tracking.getStatus().getDisplayName())
                .statusMessage(tracking.getStatusMessage())
                .deliveryPersonName(tracking.getDeliveryPersonName())
                .deliveryPersonPhone(tracking.getDeliveryPersonPhone())
                .estimatedDeliveryTime(tracking.getEstimatedDeliveryTime())
                .lastUpdated(tracking.getLastUpdated())
                .build();

        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
