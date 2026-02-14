package com.shoebank.nepalshop.repository;

import com.shoebank.nepalshop.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findBySessionId(String sessionId);
    List<Cart> findByCreatedAtBefore(LocalDateTime dateTime);
}
