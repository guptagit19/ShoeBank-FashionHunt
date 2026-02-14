package com.shoebank.nepalshop.controller;

import com.shoebank.nepalshop.dto.*;
import com.shoebank.nepalshop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@RequestHeader("X-Session-Id") String sessionId) {
        CartDTO cart = cartService.getCart(sessionId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(
            @RequestHeader("X-Session-Id") String sessionId,
            @Valid @RequestBody AddToCartRequest request) {
        try {
            CartDTO cart = cartService.addToCart(sessionId, request);
            return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(
            @RequestHeader("X-Session-Id") String sessionId,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        try {
            CartDTO cart = cartService.updateCartItem(sessionId, itemId, quantity);
            return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeFromCart(
            @RequestHeader("X-Session-Id") String sessionId,
            @PathVariable Long itemId) {
        try {
            CartDTO cart = cartService.removeFromCart(sessionId, itemId);
            return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@RequestHeader("X-Session-Id") String sessionId) {
        try {
            cartService.clearCart(sessionId);
            return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
