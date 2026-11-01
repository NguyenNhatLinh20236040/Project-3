package com.restaurant.management.dto;

import com.restaurant.management.entity.Order;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private Order.PaymentMethod paymentMethod;

    @Min(value = 0, message = "Chiết khấu không được âm")
    @Max(value = 100, message = "Chiết khấu tối đa 100%")
    private Integer discountPercent = 0;

    private String note;
}
