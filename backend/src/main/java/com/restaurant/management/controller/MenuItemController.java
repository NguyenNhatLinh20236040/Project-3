package com.restaurant.management.controller;

import com.restaurant.management.dto.MenuItemDto;
import com.restaurant.management.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Tag(name = "Menu Management", description = "Quản trị thực đơn món ăn")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping
    @Operation(summary = "Tìm kiếm và lọc thực đơn món ăn")
    public ResponseEntity<List<MenuItemDto>> getMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isSpicy,
            @RequestParam(required = false) Boolean isVegetarian) {
        return ResponseEntity.ok(menuItemService.searchMenuItems(categoryId, keyword, isSpicy, isVegetarian));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết món ăn theo ID")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @PostMapping
    @Operation(summary = "Thêm món ăn mới vào thực đơn (Admin)")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody MenuItemDto dto) {
        return new ResponseEntity<>(menuItemService.createMenuItem(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin món ăn (Admin)")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemDto dto) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, dto));
    }

    @PatchMapping("/{id}/toggle-availability")
    @Operation(summary = "Bật/Tắt trạng thái còn món (Admin/Staff)")
    public ResponseEntity<MenuItemDto> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.toggleAvailability(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa món ăn khỏi thực đơn (Admin)")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
