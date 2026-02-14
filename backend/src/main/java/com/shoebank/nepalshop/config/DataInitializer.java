package com.shoebank.nepalshop.config;

import com.shoebank.nepalshop.model.Admin;
import com.shoebank.nepalshop.model.Category;
import com.shoebank.nepalshop.repository.AdminRepository;
import com.shoebank.nepalshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!adminRepository.existsByUsername("chandradip")) {
            Admin admin = Admin.builder()
                    .username("chandradip")
                    .password(passwordEncoder.encode("chandshoeBank1232"))
                    .name("Chandradip")
                    .email("admin@shoebank.com")
                    .isActive(true)
                    .build();
            adminRepository.save(admin);
            System.out.println("Default admin created: chandradip");
        }

        // Create default categories if not exists
        if (categoryRepository.count() == 0) {
            Category shoes = Category.builder()
                    .name("Shoes")
                    .slug("shoes")
                    .description("Premium quality shoes for every occasion")
                    .displayOrder(1)
                    .isActive(true)
                    .build();

            Category clothes = Category.builder()
                    .name("Clothes")
                    .slug("clothes")
                    .description("Trendy fashion clothes for all ages")
                    .displayOrder(2)
                    .isActive(true)
                    .build();

            Category food = Category.builder()
                    .name("Food")
                    .slug("food")
                    .description("Delicious food from our restaurant")
                    .displayOrder(3)
                    .isActive(true)
                    .build();

            categoryRepository.save(shoes);
            categoryRepository.save(clothes);
            categoryRepository.save(food);

            System.out.println("Default categories created: Shoes, Clothes, Food");
        }
    }
}
