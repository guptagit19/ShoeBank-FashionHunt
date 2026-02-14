package com.shoebank.nepalshop.controller;

import com.shoebank.nepalshop.dto.*;
import com.shoebank.nepalshop.model.Admin;
import com.shoebank.nepalshop.repository.AdminRepository;
import com.shoebank.nepalshop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> login(@Valid @RequestBody AdminLoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (admin == null || !passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid username or password"));
        }

        if (!admin.getIsActive()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Account is disabled"));
        }

        // Update last login
        admin.setLastLogin(LocalDateTime.now());
        adminRepository.save(admin);

        String token = tokenProvider.generateToken(admin.getUsername());

        AdminLoginResponse response = AdminLoginResponse.builder()
                .token(token)
                .username(admin.getUsername())
                .name(admin.getName())
                .expiresIn(tokenProvider.getExpirationTime())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = tokenProvider.validateToken(token);
            return ResponseEntity.ok(ApiResponse.success(isValid));
        }
        return ResponseEntity.ok(ApiResponse.success(false));
    }
}
