package com.shoebank.nepalshop.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String image;
    private Integer displayOrder;
    private Boolean isActive;
    private Long productCount;
}
