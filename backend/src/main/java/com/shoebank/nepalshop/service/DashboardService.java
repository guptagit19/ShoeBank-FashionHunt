package com.shoebank.nepalshop.service;

import com.shoebank.nepalshop.dto.DashboardStatsDTO;
import com.shoebank.nepalshop.model.Order;
import com.shoebank.nepalshop.repository.OrderRepository;
import com.shoebank.nepalshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfWeek = LocalDate.now().minusDays(7).atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().minusDays(30).atStartOfDay();

        Long totalOrders = orderRepository.count();
        Long pendingOrders = orderRepository.countByOrderStatus(Order.OrderStatus.PENDING);
        Long completedOrders = orderRepository.countByOrderStatus(Order.OrderStatus.DELIVERED);
        Long totalProducts = productRepository.count();

        Double todayRev = orderRepository.getTotalRevenueBetweenDates(startOfToday, now);
        Double weeklyRev = orderRepository.getTotalRevenueBetweenDates(startOfWeek, now);
        Double monthlyRev = orderRepository.getTotalRevenueBetweenDates(startOfMonth, now);

        // Count low stock products (less than 10)
        Long lowStockProducts = productRepository.findAll().stream()
                .filter(p -> p.getStock() < 10 && p.getIsAvailable())
                .count();

        return DashboardStatsDTO.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .totalProducts(totalProducts)
                .todayRevenue(todayRev != null ? BigDecimal.valueOf(todayRev) : BigDecimal.ZERO)
                .weeklyRevenue(weeklyRev != null ? BigDecimal.valueOf(weeklyRev) : BigDecimal.ZERO)
                .monthlyRevenue(monthlyRev != null ? BigDecimal.valueOf(monthlyRev) : BigDecimal.ZERO)
                .lowStockProducts(lowStockProducts)
                .build();
    }
}
