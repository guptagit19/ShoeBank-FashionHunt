package com.shoebank.nepalshop.service;

import com.shoebank.nepalshop.dto.*;
import com.shoebank.nepalshop.model.*;
import com.shoebank.nepalshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final DeliveryTrackingRepository deliveryTrackingRepository;

    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) {
        Cart cart = cartRepository.findBySessionId(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        String orderType = null;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Check stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            // Set order type based on category
            if (orderType == null) {
                orderType = product.getCategory().getSlug().toUpperCase();
            }
        }

        // Calculate delivery charge (free for orders above 1000)
        BigDecimal deliveryCharge = subtotal.compareTo(new BigDecimal("1000")) >= 0 ? BigDecimal.ZERO
                : new BigDecimal("100");

        BigDecimal totalAmount = subtotal.add(deliveryCharge);

        // Create order
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryCity(request.getDeliveryCity())
                .deliveryNotes(request.getDeliveryNotes())
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(Order.PaymentStatus.PENDING)
                .orderStatus(Order.OrderStatus.PENDING)
                .orderType(orderType)
                .build();

        // Add order items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .productImage(
                            product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0)
                                    : null)
                    .price(price)
                    .quantity(cartItem.getQuantity())
                    .selectedSize(cartItem.getSelectedSize())
                    .selectedColor(cartItem.getSelectedColor())
                    .specialInstructions(cartItem.getSpecialInstructions())
                    .subtotal(price.multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .build();

            order.addItem(orderItem);

            // Update stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Create delivery tracking for food orders
        if ("FOOD".equals(orderType)) {
            DeliveryTracking tracking = DeliveryTracking.builder()
                    .order(savedOrder)
                    .status(DeliveryTracking.DeliveryStatus.ORDER_PLACED)
                    .statusMessage("Your order has been placed")
                    .build();
            deliveryTrackingRepository.save(tracking);
        }

        // Clear cart after order
        cart.getItems().clear();
        cartRepository.save(cart);

        return convertToDTO(savedOrder);
    }

    public OrderDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    public Page<OrderDTO> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToDTO);
    }

    public Page<OrderDTO> getOrdersByStatus(Order.OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByOrderStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status);

        // Update delivery tracking if exists
        DeliveryTracking tracking = deliveryTrackingRepository.findByOrderId(orderId).orElse(null);
        if (tracking != null) {
            switch (status) {
                case CONFIRMED:
                    tracking.setStatus(DeliveryTracking.DeliveryStatus.CONFIRMED);
                    tracking.setStatusMessage("Your order has been confirmed");
                    break;
                case PREPARING:
                    tracking.setStatus(DeliveryTracking.DeliveryStatus.PREPARING);
                    tracking.setStatusMessage("Your order is being prepared");
                    break;
                case READY:
                    tracking.setStatus(DeliveryTracking.DeliveryStatus.READY);
                    tracking.setStatusMessage("Your order is ready for pickup");
                    break;
                case OUT_FOR_DELIVERY:
                    tracking.setStatus(DeliveryTracking.DeliveryStatus.OUT_FOR_DELIVERY);
                    tracking.setStatusMessage("Your order is out for delivery");
                    break;
                case DELIVERED:
                    tracking.setStatus(DeliveryTracking.DeliveryStatus.DELIVERED);
                    tracking.setStatusMessage("Your order has been delivered");
                    break;
                case CANCELLED:
                    tracking.setStatus(DeliveryTracking.DeliveryStatus.CANCELLED);
                    tracking.setStatusMessage("Your order has been cancelled");
                    break;
                default:
                    break;
            }
            deliveryTrackingRepository.save(tracking);
        }

        return convertToDTO(orderRepository.save(order));
    }

    @Transactional
    public OrderDTO updatePaymentStatus(Long orderId, Order.PaymentStatus status, String transactionId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentStatus(status);
        if (transactionId != null) {
            order.setEsewaTransactionId(transactionId);
        }

        if (status == Order.PaymentStatus.COMPLETED) {
            order.setOrderStatus(Order.OrderStatus.CONFIRMED);
        }

        return convertToDTO(orderRepository.save(order));
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());

        DeliveryTrackingDTO trackingDTO = null;
        if (order.getDeliveryTracking() != null) {
            DeliveryTracking tracking = order.getDeliveryTracking();
            trackingDTO = DeliveryTrackingDTO.builder()
                    .id(tracking.getId())
                    .orderNumber(order.getOrderNumber())
                    .status(tracking.getStatus().name())
                    .statusDisplayName(tracking.getStatus().getDisplayName())
                    .statusMessage(tracking.getStatusMessage())
                    .deliveryPersonName(tracking.getDeliveryPersonName())
                    .deliveryPersonPhone(tracking.getDeliveryPersonPhone())
                    .estimatedDeliveryTime(tracking.getEstimatedDeliveryTime())
                    .lastUpdated(tracking.getLastUpdated())
                    .build();
        }

        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .customerPhone(order.getCustomerPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryCity(order.getDeliveryCity())
                .deliveryNotes(order.getDeliveryNotes())
                .items(items)
                .subtotal(order.getSubtotal())
                .deliveryCharge(order.getDeliveryCharge())
                .discount(order.getDiscount())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus().name())
                .paymentMethod(order.getPaymentMethod())
                .orderStatus(order.getOrderStatus().name())
                .orderType(order.getOrderType())
                .deliveryTracking(trackingDTO)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private OrderItemDTO convertItemToDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .productImage(item.getProductImage())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .selectedSize(item.getSelectedSize())
                .selectedColor(item.getSelectedColor())
                .specialInstructions(item.getSpecialInstructions())
                .subtotal(item.getSubtotal())
                .build();
    }
}
