package com.restaurant.management.service;

import com.restaurant.management.dto.TableDto;
import com.restaurant.management.entity.Order;
import com.restaurant.management.entity.RestaurantTable;
import com.restaurant.management.exception.BadRequestException;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.repository.OrderRepository;
import com.restaurant.management.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final RestaurantTableRepository tableRepository;
    private final OrderRepository orderRepository;

    public List<TableDto> getAllTables(String zone) {
        List<RestaurantTable> tables = (zone != null && !zone.isBlank())
                ? tableRepository.findByZone(zone)
                : tableRepository.findAll();

        return tables.stream().map(this::toDto).collect(Collectors.toList());
    }

    public TableDto getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn với ID: " + id));
        return toDto(table);
    }

    @Transactional
    public TableDto createTable(TableDto dto) {
        if (tableRepository.findByTableNumber(dto.getTableNumber()).isPresent()) {
            throw new BadRequestException("Số bàn đã tồn tại: " + dto.getTableNumber());
        }

        RestaurantTable table = RestaurantTable.builder()
                .tableNumber(dto.getTableNumber())
                .capacity(dto.getCapacity())
                .zone(dto.getZone())
                .status(dto.getStatus() != null ? dto.getStatus() : RestaurantTable.TableStatus.AVAILABLE)
                .notes(dto.getNotes())
                .build();

        return toDto(tableRepository.save(table));
    }

    @Transactional
    public TableDto updateTable(Long id, TableDto dto) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn với ID: " + id));

        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());
        table.setZone(dto.getZone());
        if (dto.getStatus() != null) table.setStatus(dto.getStatus());
        table.setNotes(dto.getNotes());

        return toDto(tableRepository.save(table));
    }

    @Transactional
    public TableDto updateTableStatus(Long id, RestaurantTable.TableStatus status) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn với ID: " + id));
        table.setStatus(status);
        return toDto(tableRepository.save(table));
    }

    @Transactional
    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy bàn với ID: " + id);
        }
        tableRepository.deleteById(id);
    }

    private TableDto toDto(RestaurantTable table) {
        TableDto dto = TableDto.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .zone(table.getZone())
                .status(table.getStatus())
                .notes(table.getNotes())
                .build();

        // Check if there is an active order for this table
        Optional<Order> activeOrder = orderRepository.findFirstByTableIdAndStatusNotOrderByCreatedAtDesc(
                table.getId(), Order.OrderStatus.PAID
        );
        if (activeOrder.isPresent() && activeOrder.get().getStatus() != Order.OrderStatus.CANCELLED) {
            dto.setCurrentOrderId(activeOrder.get().getId());
            dto.setCurrentOrderNumber(activeOrder.get().getOrderNumber());
        }

        return dto;
    }
}
