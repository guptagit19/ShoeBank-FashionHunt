package com.shoebank.nepalshop.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginResponse {
    private String token;
    private String username;
    private String name;
    private Long expiresIn;
}
