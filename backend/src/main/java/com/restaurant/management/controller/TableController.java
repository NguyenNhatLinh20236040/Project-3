package com.restaurant.management.controller;

import com.restaurant.management.dto.TableDto;
import com.restaurant.management.entity.RestaurantTable;
import com.restaurant.management.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@Tag(name = "Table Management", description = "Quản lý bàn ăn và trạng thái bàn")
public class TableController {

    private final TableService tableService;

    @GetMapping
    @Operation(summary = "Lấy danh sách bàn theo khu vực hoặc tất cả")
    public ResponseEntity<List<TableDto>> getAllTables(@RequestParam(required = false) String zone) {
        return ResponseEntity.ok(tableService.getAllTables(zone));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết thông tin bàn theo ID")
    public ResponseEntity<TableDto> getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }

    @PostMapping
    @Operation(summary = "Thêm bàn mới (Admin)")
    public ResponseEntity<TableDto> createTable(@Valid @RequestBody TableDto dto) {
        return new ResponseEntity<>(tableService.createTable(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin bàn (Admin)")
    public ResponseEntity<TableDto> updateTable(@PathVariable Long id, @Valid @RequestBody TableDto dto) {
        return ResponseEntity.ok(tableService.updateTable(id, dto));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái bàn (Trống/Có khách/Đã đặt)")
    public ResponseEntity<TableDto> updateTableStatus(
            @PathVariable Long id,
            @RequestParam RestaurantTable.TableStatus status) {
        return ResponseEntity.ok(tableService.updateTableStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa bàn (Admin)")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
