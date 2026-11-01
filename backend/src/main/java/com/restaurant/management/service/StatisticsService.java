package com.restaurant.management.service;

import com.restaurant.management.dto.DashboardStatsDto;
import com.restaurant.management.dto.RevenueChartDto;
import com.restaurant.management.dto.TopSellingItemDto;
import com.restaurant.management.entity.Order;
import com.restaurant.management.entity.Reservation;
import com.restaurant.management.entity.RestaurantTable;
import com.restaurant.management.repository.OrderItemRepository;
import com.restaurant.management.repository.OrderRepository;
import com.restaurant.management.repository.ReservationRepository;
import com.restaurant.management.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    public DashboardStatsDto getDashboardStatistics() {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        BigDecimal todayRev = orderRepository.sumRevenueBetween(todayStart, todayEnd);
        if (todayRev == null) {
            todayRev = BigDecimal.ZERO;
        }

        Long activeOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING)
                + orderRepository.countByStatus(Order.OrderStatus.PREPARING)
                + orderRepository.countByStatus(Order.OrderStatus.SERVED);

        Long pendingRes = (long) reservationRepository.findByStatus(Reservation.ReservationStatus.PENDING).size();
        Long totalTables = tableRepository.count();
        Long occupiedTables = (long) tableRepository.findByStatus(RestaurantTable.TableStatus.OCCUPIED).size();

        // 7 days revenue chart
        List<RevenueChartDto> recentRevenue = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = LocalDateTime.of(date, LocalTime.MIN);
            LocalDateTime end = LocalDateTime.of(date, LocalTime.MAX);

            BigDecimal dayRev = orderRepository.sumRevenueBetween(start, end);
            List<Order> paidOrders = orderRepository.findPaidOrdersBetween(start, end);

            recentRevenue.add(RevenueChartDto.builder()
                    .date(date.format(formatter))
                    .revenue(dayRev != null ? dayRev : BigDecimal.ZERO)
                    .orderCount((long) paidOrders.size())
                    .build());
        }

        // Top selling items
        List<Object[]> rawTopItems = orderItemRepository.findTopSellingMenuItems(PageRequest.of(0, 5));
        List<TopSellingItemDto> topSelling = new ArrayList<>();
        for (Object[] row : rawTopItems) {
            topSelling.add(TopSellingItemDto.builder()
                    .menuItemId((Long) row[0])
                    .menuItemName((String) row[1])
                    .quantitySold(((Number) row[2]).longValue())
                    .totalRevenue(new BigDecimal(row[3].toString()))
                    .build());
        }

        return DashboardStatsDto.builder()
                .todayRevenue(todayRev)
                .activeOrdersCount(activeOrders)
                .pendingReservationsCount(pendingRes)
                .occupiedTablesCount(occupiedTables)
                .totalTablesCount(totalTables)
                .recentRevenue(recentRevenue)
                .topSellingItems(topSelling)
                .build();
    }
}
