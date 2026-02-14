package com.shoebank.nepalshop.service;

import com.shoebank.nepalshop.dto.*;
import com.shoebank.nepalshop.model.*;
import com.shoebank.nepalshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartDTO getCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        return convertToDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(String sessionId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(sessionId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getIsAvailable()) {
            throw new RuntimeException("Product is not available");
        }

        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }

        // Check if product already in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Cannot add more. Stock limit: " + product.getStock());
            }
            existingItem.setQuantity(newQuantity);
            existingItem.setSelectedSize(request.getSelectedSize());
            existingItem.setSelectedColor(request.getSelectedColor());
            existingItem.setSpecialInstructions(request.getSpecialInstructions());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .selectedSize(request.getSelectedSize())
                    .selectedColor(request.getSelectedColor())
                    .specialInstructions(request.getSpecialInstructions())
                    .build();
            cart.addItem(newItem);
        }

        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO updateCartItem(String sessionId, Long itemId, Integer quantity) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getProduct().getStock()) {
                throw new RuntimeException("Quantity exceeds available stock");
            }
            item.setQuantity(quantity);
        }

        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO removeFromCart(String sessionId, Long itemId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.removeItem(item);
        cartItemRepository.delete(item);

        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String sessionId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(String sessionId) {
        return cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .sessionId(sessionId)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private CartDTO convertToDTO(Cart cart) {
        List<CartItemDTO> items = cart.getItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        return CartDTO.builder()
                .id(cart.getId())
                .sessionId(cart.getSessionId())
                .items(items)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }

    private CartItemDTO convertItemToDTO(CartItem item) {
        Product product = item.getProduct();
        BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0)
                        : null)
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .quantity(item.getQuantity())
                .selectedSize(item.getSelectedSize())
                .selectedColor(item.getSelectedColor())
                .specialInstructions(item.getSpecialInstructions())
                .subtotal(price.multiply(BigDecimal.valueOf(item.getQuantity())))
                .availableStock(product.getStock())
                .build();
    }
}
