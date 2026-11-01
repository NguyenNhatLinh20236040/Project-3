package com.restaurant.management.dto;

import com.restaurant.management.entity.RestaurantTable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableDto {
    private Long id;

    @NotBlank(message = "Số bàn không được để trống")
    private String tableNumber;

    @NotNull(message = "Sức chứa không được để trống")
    @Min(value = 1, message = "Sức chứa tối thiểu 1 người")
    private Integer capacity;

    @NotBlank(message = "Khu vực không được để trống")
    private String zone;

    private RestaurantTable.TableStatus status;
    private String notes;
    private Long currentOrderId;
    private String currentOrderNumber;
}
