package com.restaurant.management.controller;

import com.restaurant.management.dto.*;
import com.restaurant.management.entity.Order;
import com.restaurant.management.entity.OrderItem;
import com.restaurant.management.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "Quản lý gọi món, phục vụ tại bàn và thanh toán")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Lấy danh sách đơn hàng (lọc theo trạng thái)")
    public ResponseEntity<List<OrderDto>> getAllOrders(@RequestParam(required = false) Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn hàng theo ID")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/table/{tableId}/active")
    @Operation(summary = "Lấy đơn hàng đang hoạt động của bàn")
    public ResponseEntity<OrderDto> getActiveOrderByTable(@PathVariable Long tableId) {
        return ResponseEntity.ok(orderService.getActiveOrderByTableId(tableId));
    }

    @GetMapping("/lookup/{orderNumber}")
    @Operation(summary = "Tra cứu đơn hàng bằng mã hóa đơn")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @PostMapping
    @Operation(summary = "Tạo đơn gọi món mới tại bàn")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return new ResponseEntity<>(orderService.createOrder(request), HttpStatus.CREATED);
    }

    @PostMapping("/customer")
    @Operation(summary = "Khách hàng tự đặt món trực tuyến")
    public ResponseEntity<OrderDto> createCustomerOrder(@Valid @RequestBody CreateOrderRequest request) {
        return new ResponseEntity<>(orderService.createOrder(request), HttpStatus.CREATED);
    }

    @PostMapping("/{orderId}/items")
    @Operation(summary = "Gọi thêm món vào đơn hàng hiện tại của bàn")
    public ResponseEntity<OrderDto> addItemsToOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody List<AddOrderItemRequest> items) {
        return ResponseEntity.ok(orderService.addItemsToOrder(orderId, items));
    }

    @PatchMapping("/{orderId}/status")
    @Operation(summary = "Cập nhật trạng thái đơn hàng")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PatchMapping("/items/{itemId}/status")
    @Operation(summary = "Cập nhật trạng thái chế biến món ăn (Nhà bếp / Bồi bàn)")
    public ResponseEntity<OrderItemDto> updateOrderItemStatus(
            @PathVariable Long itemId,
            @RequestParam OrderItem.ItemStatus status) {
        return ResponseEntity.ok(orderService.updateOrderItemStatus(itemId, status));
    }

    @PostMapping("/{orderId}/checkout")
    @Operation(summary = "Thanh toán đơn hàng và giải phóng bàn")
    public ResponseEntity<OrderDto> checkout(
            @PathVariable Long orderId,
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(orderId, request));
    }
}
