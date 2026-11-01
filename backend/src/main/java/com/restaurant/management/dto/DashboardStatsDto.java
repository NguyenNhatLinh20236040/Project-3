package com.restaurant.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private BigDecimal todayRevenue;
    private Long activeOrdersCount;
    private Long pendingReservationsCount;
    private Long occupiedTablesCount;
    private Long totalTablesCount;
    private List<RevenueChartDto> recentRevenue;
    private List<TopSellingItemDto> topSellingItems;
}
