package com.shoebank.nepalshop.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Long totalOrders;
    private Long pendingOrders;
    private Long completedOrders;
    private Long totalProducts;
    private BigDecimal todayRevenue;
    private BigDecimal weeklyRevenue;
    private BigDecimal monthlyRevenue;
    private Long lowStockProducts;
}
