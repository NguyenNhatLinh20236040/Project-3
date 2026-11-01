package com.restaurant.management.service;

import com.restaurant.management.dto.ReservationDto;
import com.restaurant.management.dto.ReservationRequest;
import com.restaurant.management.entity.Reservation;
import com.restaurant.management.entity.RestaurantTable;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.repository.ReservationRepository;
import com.restaurant.management.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    public List<ReservationDto> getAllReservations(Reservation.ReservationStatus status) {
        List<Reservation> reservations = (status != null)
                ? reservationRepository.findByStatus(status)
                : reservationRepository.findAllByOrderByReservationTimeDesc();

        return reservations.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ReservationDto> getReservationsByPhone(String phone) {
        return reservationRepository.findByCustomerPhone(phone).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ReservationDto getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt bàn với ID: " + id));
        return toDto(reservation);
    }

    @Transactional
    public ReservationDto createReservation(ReservationRequest request) {
        RestaurantTable table = null;
        if (request.getTableId() != null) {
            table = tableRepository.findById(request.getTableId()).orElse(null);
            if (table != null) {
                table.setStatus(RestaurantTable.TableStatus.RESERVED);
                tableRepository.save(table);
            }
        }

        Reservation reservation = Reservation.builder()
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .guestCount(request.getGuestCount())
                .reservationTime(request.getReservationTime())
                .table(table)
                .status(Reservation.ReservationStatus.PENDING)
                .specialRequests(request.getSpecialRequests())
                .createdAt(LocalDateTime.now())
                .build();

        return toDto(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationDto updateReservationStatus(Long id, Reservation.ReservationStatus status, Long tableId) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt bàn với ID: " + id));

        reservation.setStatus(status);

        if (tableId != null) {
            RestaurantTable table = tableRepository.findById(tableId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn với ID: " + tableId));
            reservation.setTable(table);
            if (status == Reservation.ReservationStatus.CONFIRMED) {
                table.setStatus(RestaurantTable.TableStatus.RESERVED);
            } else if (status == Reservation.ReservationStatus.COMPLETED) {
                table.setStatus(RestaurantTable.TableStatus.OCCUPIED);
            } else if (status == Reservation.ReservationStatus.CANCELLED) {
                table.setStatus(RestaurantTable.TableStatus.AVAILABLE);
            }
            tableRepository.save(table);
        } else if (reservation.getTable() != null && status == Reservation.ReservationStatus.CANCELLED) {
            RestaurantTable table = reservation.getTable();
            table.setStatus(RestaurantTable.TableStatus.AVAILABLE);
            tableRepository.save(table);
        }

        return toDto(reservationRepository.save(reservation));
    }

    private ReservationDto toDto(Reservation reservation) {
        return ReservationDto.builder()
                .id(reservation.getId())
                .customerName(reservation.getCustomerName())
                .customerPhone(reservation.getCustomerPhone())
                .customerEmail(reservation.getCustomerEmail())
                .guestCount(reservation.getGuestCount())
                .reservationTime(reservation.getReservationTime())
                .tableId(reservation.getTable() != null ? reservation.getTable().getId() : null)
                .tableNumber(reservation.getTable() != null ? reservation.getTable().getTableNumber() : null)
                .zone(reservation.getTable() != null ? reservation.getTable().getZone() : null)
                .status(reservation.getStatus())
                .specialRequests(reservation.getSpecialRequests())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
