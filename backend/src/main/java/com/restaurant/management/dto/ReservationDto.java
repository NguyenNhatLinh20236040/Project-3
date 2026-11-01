package com.restaurant.management.dto;

import com.restaurant.management.entity.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Integer guestCount;
    private LocalDateTime reservationTime;
    private Long tableId;
    private String tableNumber;
    private String zone;
    private Reservation.ReservationStatus status;
    private String specialRequests;
    private LocalDateTime createdAt;
}
