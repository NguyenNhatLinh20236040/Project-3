package com.restaurant.management.service;

import com.restaurant.management.dto.*;
import com.restaurant.management.entity.*;
import com.restaurant.management.exception.BadRequestException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.repository.MenuItemRepository;
import com.restaurant.management.repository.OrderItemRepository;
import com.restaurant.management.repository.OrderRepository;
import com.restaurant.management.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;

    public List<OrderDto> getAllOrders(Order.OrderStatus status) {
        List<Order> orders = (status != null)
                ? orderRepository.findByStatus(status)
                : orderRepository.findAllByOrderByCreatedAtDesc();

        return orders.stream().map(this::toDto).collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        return toDto(order);
    }

    public OrderDto getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderNumber));
        return toDto(order);
    }

    public OrderDto getActiveOrderByTableId(Long tableId) {
        Order order = orderRepository.findFirstByTableIdAndStatusNotOrderByCreatedAtDesc(tableId, Order.OrderStatus.PAID)
                .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
                .orElseThrow(() -> new ResourceNotFoundException("Bàn hiện tại chưa có đơn hàng nào"));
        return toDto(order);
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        RestaurantTable table = null;
        if (request.getTableId() != null) {
            table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn với ID: " + request.getTableId()));

            // Update table status to OCCUPIED
            table.setStatus(RestaurantTable.TableStatus.OCCUPIED);
            tableRepository.save(table);
        }

        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" +
                UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .table(table)
                .orderType(request.getOrderType() != null ? request.getOrderType() : Order.OrderType.DINE_IN)
                .status(Order.OrderStatus.PENDING)
                .note(request.getNote())
                .serverName(request.getServerName() != null ? request.getServerName() : "Nhân viên")
                .createdAt(LocalDateTime.now())
                .build();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (AddOrderItemRequest itemReq : request.getItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn ID: " + itemReq.getMenuItemId()));

                OrderItem item = OrderItem.builder()
                        .menuItem(menuItem)
                        .quantity(itemReq.getQuantity())
                        .price(menuItem.getPrice())
                        .note(itemReq.getNote())
                        .status(OrderItem.ItemStatus.QUEUED)
                        .build();

                order.addItem(item);
            }
        }

        order.recalculateTotals();
        return toDto(orderRepository.save(order));
    }

    @Transactional
    public OrderDto addItemsToOrder(Long orderId, List<AddOrderItemRequest> itemRequests) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() == Order.OrderStatus.PAID || order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Không thể thêm món vào đơn hàng đã thanh toán hoặc đã hủy");
        }

        for (AddOrderItemRequest itemReq : itemRequests) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn ID: " + itemReq.getMenuItemId()));

            OrderItem item = OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .price(menuItem.getPrice())
                    .note(itemReq.getNote())
                    .status(OrderItem.ItemStatus.QUEUED)
                    .build();

            order.addItem(item);
        }

        order.recalculateTotals();
        return toDto(orderRepository.save(order));
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        order.setStatus(status);

        if (status == Order.OrderStatus.CANCELLED && order.getTable() != null) {
            RestaurantTable table = order.getTable();
            table.setStatus(RestaurantTable.TableStatus.AVAILABLE);
            tableRepository.save(table);
        }

        return toDto(orderRepository.save(order));
    }

    @Transactional
    public OrderItemDto updateOrderItemStatus(Long itemId, OrderItem.ItemStatus status) {
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món trong đơn với ID: " + itemId));

        item.setStatus(status);
        orderItemRepository.save(item);

        return toItemDto(item);
    }

    @Transactional
    public OrderDto checkout(Long orderId, CheckoutRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() == Order.OrderStatus.PAID) {
            throw new BadRequestException("Đơn hàng này đã được thanh toán trước đó");
        }

        order.setPaymentMethod(request.getPaymentMethod());
        order.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0);
        order.recalculateTotals();
        order.setStatus(Order.OrderStatus.PAID);
        order.setPaymentTime(LocalDateTime.now());
        if (request.getNote() != null && !request.getNote().isBlank()) {
            order.setNote(request.getNote());
        }

        // Free up the table
        if (order.getTable() != null) {
            RestaurantTable table = order.getTable();
            table.setStatus(RestaurantTable.TableStatus.AVAILABLE);
            tableRepository.save(table);
        }

        return toDto(orderRepository.save(order));
    }

    private OrderDto toDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .zone(order.getTable() != null ? order.getTable().getZone() : null)
                .orderType(order.getOrderType())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .discountPercent(order.getDiscountPercent())
                .finalAmount(order.getFinalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentTime(order.getPaymentTime())
                .createdAt(order.getCreatedAt())
                .note(order.getNote())
                .serverName(order.getServerName())
                .items(itemDtos)
                .build();
    }

    private OrderItemDto toItemDto(OrderItem item) {
        return OrderItemDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .menuItemImage(item.getMenuItem().getImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .note(item.getNote())
                .status(item.getStatus())
                .build();
    }
}
