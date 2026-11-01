package com.restaurant.management.config;

import com.restaurant.management.entity.*;
import com.restaurant.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final ReservationRepository reservationRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Users
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("123456"))
                .fullName("Quản lý Nhà hàng")
                .role(Role.ROLE_ADMIN)
                .email("admin@restaurant.vn")
                .phone("0988888888")
                .active(true)
                .build();

        User staff = User.builder()
                .username("staff")
                .password(passwordEncoder.encode("123456"))
                .fullName("Nguyễn Văn Nhân Viên")
                .role(Role.ROLE_STAFF)
                .email("staff@restaurant.vn")
                .phone("0977777777")
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, staff));

        // 2. Seed Categories
        Category khaiVi = Category.builder().name("Món Khai Vị").description("Các món nhẹ mở đầu bữa tiệc").icon("Salad").build();
        Category monChinh = Category.builder().name("Món Chính").description("Đặc sản hảo hạng từ thịt và hải sản tươi sống").icon("Utensils").build();
        Category comMi = Category.builder().name("Cơm & Mì").description("Các món no chuẩn phong vị Á - Âu").icon("Soup").build();
        Category lau = Category.builder().name("Lẩu & Nướng").description("Hương vị đậm đà cho những buổi tụ họp ấm cúng").icon("Flame").build();
        Category trangMieng = Category.builder().name("Tráng Miệng").description("Bánh ngọt, kem và chè thanh mát").icon("Cake").build();
        Category doUong = Category.builder().name("Đồ Uống").description("Nước ép trái cây, trà thơm và đồ uống giải khát").icon("Coffee").build();

        categoryRepository.saveAll(List.of(khaiVi, monChinh, comMi, lau, trangMieng, doUong));

        // 3. Seed Menu Items
        MenuItem m1 = MenuItem.builder()
                .name("Gỏi Cuốn Tôm Thịt").description("Tôm sú tươi giòn kèm thịt ba chỉ, bún tươi và rau thơm cuốn bánh tráng, chấm tương đậu phộng.")
                .price(new BigDecimal("75000")).imageUrl("https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600")
                .category(khaiVi).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(10).build();

        MenuItem m2 = MenuItem.builder()
                .name("Salad Ức Gà Áp Chảo").description("Rau xà lách tươi hữu cơ, cà chua bi, sốt chanh leo chua ngọt kết hợp ức gà nướng thơm lừng.")
                .price(new BigDecimal("95000")).imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600")
                .category(khaiVi).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(12).build();

        MenuItem m3 = MenuItem.builder()
                .name("Nem Rán Hà Nội Truyền Thống").description("Nem giòn rụm với nhân thịt nạc vai, mộc nhĩ, miến dong ăn kèm nước mắm ớt chua ngọt.")
                .price(new BigDecimal("85000")).imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?w=600")
                .category(khaiVi).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(15).build();

        MenuItem m4 = MenuItem.builder()
                .name("Bò Bít Tết Sốt Tiêu Đen").description("Thăn bò Úc nướng đá mềm mọng sốt hạt tiêu đen Phú Quốc đậm đà kèm khoai tây nghiền.")
                .price(new BigDecimal("280000")).imageUrl("https://images.unsplash.com/photo-1558030006-450675393462?w=600")
                .category(monChinh).isAvailable(true).isSpicy(true).isVegetarian(false).preparationTimeMinutes(20).build();

        MenuItem m5 = MenuItem.builder()
                .name("Cá Hồi Na Uy Nướng Bơ Tỏi").description("Phi lê cá hồi tươi ngon áp chảo sốt bơ tỏi thơm ngậy, ăn cùng măng tây nướng.")
                .price(new BigDecimal("320000")).imageUrl("https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600")
                .category(monChinh).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(18).build();

        MenuItem m6 = MenuItem.builder()
                .name("Tôm Sú Hoàng Bào Sốt Trứng Muối").description("Tôm sú lớn chiên giòn áo lớp sốt trứng muối béo ngậy, dậy mùi lá cari thơm nồng.")
                .price(new BigDecimal("240000")).imageUrl("https://images.unsplash.com/photo-1559737558-2451399c42a2?w=600")
                .category(monChinh).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(15).build();

        MenuItem m7 = MenuItem.builder()
                .name("Cơm Chiên Hải Sản Hoàng Kim").description("Cơm hạt ngọc dẻo thơm rang giòn tơi hạt, trộn mực tươi, tôm và rau củ quả.")
                .price(new BigDecimal("120000")).imageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600")
                .category(comMi).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(12).build();

        MenuItem m8 = MenuItem.builder()
                .name("Mì Ý Bò Bằm Sốt Cà Bolognese").description("Sợi mì Spaghetti chuẩn Ý hòa quyện cùng thịt bò bằm hầm nhừ sốt cà chua và phô mai Parmesan.")
                .price(new BigDecimal("135000")).imageUrl("https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=600")
                .category(comMi).isAvailable(true).isSpicy(false).isVegetarian(false).preparationTimeMinutes(15).build();

        MenuItem m9 = MenuItem.builder()
                .name("Lẩu Thái Tom Yum Hải Sản").description("Nồi lẩu chua cay kích thích vị giác với nước dùng cốt dừa, tôm sú, ngao hoa, mực và nấm tươi.")
                .price(new BigDecimal("450000")).imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600")
                .category(lau).isAvailable(true).isSpicy(true).isVegetarian(false).preparationTimeMinutes(25).build();

        MenuItem m10 = MenuItem.builder()
                .name("Chè Khúc Bạch Thanh Mát").description("Những viên khúc bạch sữa mềm béo, kèm long nhãn thơm ngọt và hạnh nhân giòn tan.")
                .price(new BigDecimal("450000")).imageUrl("https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600")
                .category(trangMieng).isAvailable(true).isSpicy(false).isVegetarian(true).preparationTimeMinutes(5).build();

        MenuItem m11 = MenuItem.builder()
                .name("Kem Dừa Xiêm Non").description("Kem dừa ngọt dịu đựng trong trái dừa xiêm, rắc thêm lạc rang bùi bùi và dừa nạo sấy.")
                .price(new BigDecimal("60000")).imageUrl("https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600")
                .category(trangMieng).isAvailable(true).isSpicy(false).isVegetarian(true).preparationTimeMinutes(5).build();

        MenuItem m12 = MenuItem.builder()
                .name("Trà Đào Cam Sả Tươi").description("Hương thơm tinh tế từ sả tươi, cam vàng mọng nước kết hợp cùng đào giòn ngọt lịm mát lạnh.")
                .price(new BigDecimal("45000")).imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600")
                .category(doUong).isAvailable(true).isSpicy(false).isVegetarian(true).preparationTimeMinutes(5).build();

        MenuItem m13 = MenuItem.builder()
                .name("Nước Ép Dưa Hấu Bạc Hà").description("Dưa hấu tươi ép nguyên chất không thêm đường kết hợp lá bạc hà mát lạnh sảng khoái.")
                .price(new BigDecimal("50000")).imageUrl("https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600")
                .category(doUong).isAvailable(true).isSpicy(false).isVegetarian(true).preparationTimeMinutes(5).build();

        menuItemRepository.saveAll(List.of(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13));

        // 4. Seed Restaurant Tables
        RestaurantTable t1 = RestaurantTable.builder().tableNumber("Bàn 01").capacity(4).zone("Tầng 1 - Sân Vườn").status(RestaurantTable.TableStatus.AVAILABLE).build();
        RestaurantTable t2 = RestaurantTable.builder().tableNumber("Bàn 02").capacity(4).zone("Tầng 1 - Sân Vườn").status(RestaurantTable.TableStatus.OCCUPIED).build();
        RestaurantTable t3 = RestaurantTable.builder().tableNumber("Bàn 03").capacity(2).zone("Tầng 1 - Sân Vườn").status(RestaurantTable.TableStatus.AVAILABLE).build();
        RestaurantTable t4 = RestaurantTable.builder().tableNumber("Bàn 04").capacity(6).zone("Tầng 1 - Sân Vườn").status(RestaurantTable.TableStatus.RESERVED).build();

        RestaurantTable t5 = RestaurantTable.builder().tableNumber("Bàn 05").capacity(4).zone("Tầng 2 - Máy Lạnh").status(RestaurantTable.TableStatus.AVAILABLE).build();
        RestaurantTable t6 = RestaurantTable.builder().tableNumber("Bàn 06").capacity(4).zone("Tầng 2 - Máy Lạnh").status(RestaurantTable.TableStatus.OCCUPIED).build();
        RestaurantTable t7 = RestaurantTable.builder().tableNumber("Bàn 07").capacity(8).zone("Tầng 2 - Máy Lạnh").status(RestaurantTable.TableStatus.AVAILABLE).build();
        RestaurantTable t8 = RestaurantTable.builder().tableNumber("Bàn 08").capacity(2).zone("Tầng 2 - Máy Lạnh").status(RestaurantTable.TableStatus.AVAILABLE).build();

        RestaurantTable t9 = RestaurantTable.builder().tableNumber("VIP 01").capacity(10).zone("Phòng VIP").status(RestaurantTable.TableStatus.AVAILABLE).build();
        RestaurantTable t10 = RestaurantTable.builder().tableNumber("VIP 02").capacity(12).zone("Phòng VIP").status(RestaurantTable.TableStatus.AVAILABLE).build();
        RestaurantTable t11 = RestaurantTable.builder().tableNumber("VIP 03").capacity(6).zone("Phòng VIP").status(RestaurantTable.TableStatus.RESERVED).build();
        RestaurantTable t12 = RestaurantTable.builder().tableNumber("VIP 04").capacity(16).zone("Phòng VIP").status(RestaurantTable.TableStatus.AVAILABLE).build();

        tableRepository.saveAll(List.of(t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12));

        // 5. Seed Reservations
        Reservation res1 = Reservation.builder()
                .customerName("Trần Hoàng Nam")
                .customerPhone("0912345678")
                .customerEmail("nam.tran@gmail.com")
                .guestCount(6)
                .reservationTime(LocalDateTime.now().plusHours(3))
                .table(t4)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .specialRequests("Cần ghế ăn trẻ em và bàn nhìn ra sân vườn")
                .build();

        Reservation res2 = Reservation.builder()
                .customerName("Lê Thu Hà")
                .customerPhone("0987654321")
                .customerEmail("thuha.le@gmail.com")
                .guestCount(5)
                .reservationTime(LocalDateTime.now().plusDays(1).withHour(19).withMinute(0))
                .table(t11)
                .status(Reservation.ReservationStatus.PENDING)
                .specialRequests("Tiệc sinh nhật gia đình, chuẩn bị trước đĩa hoa quả")
                .build();

        reservationRepository.saveAll(List.of(res1, res2));

        // 6. Seed Active Order on Table 02
        Order activeOrder = Order.builder()
                .orderNumber("ORD-20261028-0001")
                .table(t2)
                .orderType(Order.OrderType.DINE_IN)
                .status(Order.OrderStatus.PREPARING)
                .serverName("Nguyễn Văn Nhân Viên")
                .note("Khách yêu cầu mang đồ uống lên trước")
                .createdAt(LocalDateTime.now().minusMinutes(25))
                .build();

        activeOrder.addItem(OrderItem.builder().menuItem(m4).quantity(1).price(m4.getPrice()).status(OrderItem.ItemStatus.COOKING).build());
        activeOrder.addItem(OrderItem.builder().menuItem(m1).quantity(2).price(m1.getPrice()).status(OrderItem.ItemStatus.SERVED).build());
        activeOrder.addItem(OrderItem.builder().menuItem(m12).quantity(2).price(m12.getPrice()).status(OrderItem.ItemStatus.SERVED).build());
        activeOrder.recalculateTotals();

        // 7. Seed Past Completed Orders (for chart and statistics)
        for (int i = 6; i >= 0; i--) {
            LocalDateTime orderDate = LocalDateTime.now().minusDays(i).withHour(12 + (i % 6)).withMinute(30);

            Order pastOrder = Order.builder()
                    .orderNumber("ORD-PAST-" + (100 + i))
                    .table(t5)
                    .orderType(Order.OrderType.DINE_IN)
                    .status(Order.OrderStatus.PAID)
                    .paymentMethod(i % 2 == 0 ? Order.PaymentMethod.BANK_TRANSFER_QR : Order.PaymentMethod.CASH)
                    .paymentTime(orderDate.plusMinutes(45))
                    .createdAt(orderDate)
                    .serverName("Nguyễn Văn Nhân Viên")
                    .build();

            pastOrder.addItem(OrderItem.builder().menuItem(m4).quantity(1 + (i % 2)).price(m4.getPrice()).status(OrderItem.ItemStatus.SERVED).build());
            pastOrder.addItem(OrderItem.builder().menuItem(m7).quantity(2).price(m7.getPrice()).status(OrderItem.ItemStatus.SERVED).build());
            pastOrder.addItem(OrderItem.builder().menuItem(m12).quantity(3).price(m12.getPrice()).status(OrderItem.ItemStatus.SERVED).build());
            pastOrder.recalculateTotals();
            orderRepository.save(pastOrder);
        }

        orderRepository.save(activeOrder);
    }
}
