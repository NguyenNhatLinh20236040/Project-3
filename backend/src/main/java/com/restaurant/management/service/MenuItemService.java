package com.restaurant.management.service;

import com.restaurant.management.dto.MenuItemDto;
import com.restaurant.management.entity.Category;
import com.restaurant.management.entity.MenuItem;
import com.restaurant.management.exception.ResourceNotFoundException;
import com.restaurant.management.repository.CategoryRepository;
import com.restaurant.management.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    public List<MenuItemDto> searchMenuItems(Long categoryId, String keyword, Boolean isSpicy, Boolean isVegetarian) {
        return menuItemRepository.searchMenuItems(categoryId, keyword, isSpicy, isVegetarian)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id));
        return toDto(item);
    }

    @Transactional
    public MenuItemDto createMenuItem(MenuItemDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + dto.getCategoryId()));

        MenuItem item = MenuItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .category(category)
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .isSpicy(dto.getIsSpicy() != null ? dto.getIsSpicy() : false)
                .isVegetarian(dto.getIsVegetarian() != null ? dto.getIsVegetarian() : false)
                .preparationTimeMinutes(dto.getPreparationTimeMinutes() != null ? dto.getPreparationTimeMinutes() : 15)
                .build();

        return toDto(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long id, MenuItemDto dto) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + dto.getCategoryId()));

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setImageUrl(dto.getImageUrl());
        item.setCategory(category);
        if (dto.getIsAvailable() != null) item.setIsAvailable(dto.getIsAvailable());
        if (dto.getIsSpicy() != null) item.setIsSpicy(dto.getIsSpicy());
        if (dto.getIsVegetarian() != null) item.setIsVegetarian(dto.getIsVegetarian());
        if (dto.getPreparationTimeMinutes() != null) item.setPreparationTimeMinutes(dto.getPreparationTimeMinutes());

        return toDto(menuItemRepository.save(item));
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    @Transactional
    public MenuItemDto toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id));
        item.setIsAvailable(!item.getIsAvailable());
        return toDto(menuItemRepository.save(item));
    }

    private MenuItemDto toDto(MenuItem item) {
        return MenuItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .isAvailable(item.getIsAvailable())
                .isSpicy(item.getIsSpicy())
                .isVegetarian(item.getIsVegetarian())
                .preparationTimeMinutes(item.getPreparationTimeMinutes())
                .build();
    }
}
