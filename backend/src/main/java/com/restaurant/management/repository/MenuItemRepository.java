package com.restaurant.management.repository;

import com.restaurant.management.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryId(Long categoryId);
    List<MenuItem> findByIsAvailable(Boolean isAvailable);
    
    @Query("SELECT m FROM MenuItem m WHERE " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:keyword IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:isSpicy IS NULL OR m.isSpicy = :isSpicy) AND " +
           "(:isVegetarian IS NULL OR m.isVegetarian = :isVegetarian)")
    List<MenuItem> searchMenuItems(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            @Param("isSpicy") Boolean isSpicy,
            @Param("isVegetarian") Boolean isVegetarian
    );
}
