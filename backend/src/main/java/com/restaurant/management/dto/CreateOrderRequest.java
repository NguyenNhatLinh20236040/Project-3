package com.restaurant.management.dto;

import com.restaurant.management.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long tableId;
    private Order.OrderType orderType = Order.OrderType.DINE_IN;
    private String note;
    private String serverName;
    private List<AddOrderItemRequest> items = new ArrayList<>();
}
