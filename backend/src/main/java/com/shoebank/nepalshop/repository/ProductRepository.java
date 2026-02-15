package com.shoebank.nepalshop.repository;

import com.shoebank.nepalshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

       Page<Product> findByCategoryIdAndIsAvailableTrue(Long categoryId, Pageable pageable);

       Page<Product> findByIsAvailableTrue(Pageable pageable);

       List<Product> findByIsFeaturedTrueAndIsAvailableTrue();

       @Query("SELECT p FROM Product p WHERE p.isAvailable = true AND " +
                     "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                     "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
       Page<Product> searchProducts(@Param("search") String search, Pageable pageable);

       @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isAvailable = true AND " +
                     "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                     "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
       Page<Product> searchProductsByCategory(@Param("categoryId") Long categoryId,
                     @Param("search") String search,
                     Pageable pageable);

       // Unified filter query with all filterable attributes
       @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.tags t WHERE p.isAvailable = true " +
                     "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
                     "AND (:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) "
                     +
                     "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
                     "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
                     "AND (:brand IS NULL OR LOWER(p.brand) = LOWER(:brand)) " +
                     "AND (:gender IS NULL OR LOWER(p.gender) = LOWER(:gender)) " +
                     "AND (:occasion IS NULL OR LOWER(p.occasion) = LOWER(:occasion)) " +
                     "AND (:tag IS NULL OR LOWER(t) = LOWER(:tag))")
       Page<Product> findByFilters(@Param("categoryId") Long categoryId,
                     @Param("search") String search,
                     @Param("minPrice") BigDecimal minPrice,
                     @Param("maxPrice") BigDecimal maxPrice,
                     @Param("brand") String brand,
                     @Param("gender") String gender,
                     @Param("occasion") String occasion,
                     @Param("tag") String tag,
                     Pageable pageable);

       List<Product> findByCategorySlugAndIsAvailableTrue(String categorySlug);

       long countByCategoryId(Long categoryId);
}
