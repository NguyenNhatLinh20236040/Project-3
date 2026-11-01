package com.restaurant.management.controller;

import com.restaurant.management.dto.ReservationDto;
import com.restaurant.management.dto.ReservationRequest;
import com.restaurant.management.entity.Reservation;
import com.restaurant.management.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservation Management", description = "Quản lý đặt bàn trực tuyến")
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách đặt bàn (Admin/Staff)")
    public ResponseEntity<List<ReservationDto>> getAllReservations(
            @RequestParam(required = false) Reservation.ReservationStatus status) {
        return ResponseEntity.ok(reservationService.getAllReservations(status));
    }

    @GetMapping("/lookup")
    @Operation(summary = "Khách hàng tra cứu đặt bàn theo số điện thoại")
    public ResponseEntity<List<ReservationDto>> getReservationsByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(reservationService.getReservationsByPhone(phone));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn đặt bàn theo ID")
    public ResponseEntity<ReservationDto> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo đơn đặt bàn mới (Khách hàng hoặc Nhân viên)")
    public ResponseEntity<ReservationDto> createReservation(@Valid @RequestBody ReservationRequest request) {
        return new ResponseEntity<>(reservationService.createReservation(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đặt bàn (Xác nhận, Hoàn thành, Hủy)")
    public ResponseEntity<ReservationDto> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam Reservation.ReservationStatus status,
            @RequestParam(required = false) Long tableId) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status, tableId));
    }
}
