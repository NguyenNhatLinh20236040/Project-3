package com.restaurant.management.repository;

import com.restaurant.management.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findFirstByTableIdAndStatusNotOrderByCreatedAtDesc(Long tableId, Order.OrderStatus status);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByTableId(Long tableId);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") Order.OrderStatus status);

    @Query("SELECT SUM(o.finalAmount) FROM Order o WHERE o.status = 'PAID' AND o.paymentTime BETWEEN :start AND :end")
    BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT o FROM Order o WHERE o.status = 'PAID' AND o.paymentTime BETWEEN :start AND :end ORDER BY o.paymentTime ASC")
    List<Order> findPaidOrdersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
