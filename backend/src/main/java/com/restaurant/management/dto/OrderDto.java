package com.restaurant.management.dto;

import com.restaurant.management.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long tableId;
    private String tableNumber;
    private String zone;
    private Order.OrderType orderType;
    private Order.OrderStatus status;
    private BigDecimal totalAmount;
    private Integer discountPercent;
    private BigDecimal finalAmount;
    private Order.PaymentMethod paymentMethod;
    private LocalDateTime paymentTime;
    private LocalDateTime createdAt;
    private String note;
    private String serverName;
    @Builder.Default
    private List<OrderItemDto> items = new ArrayList<>();
}
