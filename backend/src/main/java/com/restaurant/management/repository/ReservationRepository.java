package com.restaurant.management.repository;

import com.restaurant.management.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCustomerPhone(String customerPhone);
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
    List<Reservation> findByReservationTimeBetweenOrderByReservationTimeAsc(LocalDateTime start, LocalDateTime end);
    List<Reservation> findAllByOrderByReservationTimeDesc();
}
