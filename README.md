# HỆ THỐNG QUẢN LÝ NHÀ HÀNG (RESTAURANT MANAGEMENT SYSTEM)
### Đồ Án Project 3 (Mã học phần: IT3940) - Đại Học Bách Khoa Hà Nội (HUST)

> **Công nghệ sử dụng:** Java Spring Boot 3, ReactJS (Vite), Tailwind CSS, Spring Security + JWT, H2 In-Memory Database (hỗ trợ chuyển đổi MySQL bằng 1 dòng cấu hình), Swagger OpenAPI 3.

---

## 📌 1. Giới Thiệu Đề Tài
Hệ thống Quản lý Nhà hàng Golden Spoon giải quyết bài toán số hóa toàn diện quy trình vận hành dịch vụ ăn uống:
- **Phân hệ Khách hàng (Customer Portal):** Xem thực đơn trực quan, tìm kiếm/lọc món (chay, cay), đặt bàn trực tuyến chọn vị trí theo khu vực, gọi món trước vào giỏ hàng, tra cứu tiến độ chế biến và trạng thái đặt bàn theo SĐT/Mã đơn.
- **Phân hệ Phục vụ & Thu ngân (POS Portal):** Sơ đồ bàn trực quan theo khu vực (Tầng 1, Tầng 2, Phòng VIP) với mã màu trạng thái (Trống - Xanh, Có khách - Đỏ, Đã đặt - Vàng), mở bàn gọi món tại chỗ, thêm món nhanh, chuyển trạng thái chế biến và thanh toán hóa đơn linh hoạt (Tiền mặt, Quẹt thẻ, VietQR động).
- **Phân hệ Quản trị (Admin Portal):** Dashboard thống kê doanh thu theo thời gian thực (hôm nay, 7 ngày qua dạng biểu đồ cột), top 5 món ăn bán chạy nhất, tỷ lệ lấp đầy bàn, quản lý toàn diện thực đơn (CRUD món ăn, giá, hình ảnh, tình trạng còn/hết), quản lý cấu hình bàn ăn và phê duyệt đặt bàn.

---

## 🚀 2. Hướng Dẫn Cài Đặt & Khởi Chạy Nhanh

### Yêu cầu môi trường:
- Java JDK 17+ (Dự án tương thích hoàn hảo với Java 17, 21 và 23).
- Node.js 18+ và npm 9+.

### Cách 1: Chạy Backend (Spring Boot)
```bash
cd backend
# Trên Windows:
.\gradlew.bat bootRun

# Trên Linux/macOS:
./gradlew bootRun
```
* Backend khởi động tại: `http://localhost:8080`
* H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:restaurantdb`, user: `sa`, password để trống)
* Swagger / OpenAPI 3 tài liệu API: `http://localhost:8080/swagger-ui.html`

### Cách 2: Chạy Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* Giao diện web khởi chạy tại: `http://localhost:5173`

---

## 🔑 3. Tài Khoản Demo Thử Nghiệm

Hệ thống đã tích hợp sẵn nút bấm **Đăng nhập nhanh 1-Click** ngay trên popup đăng nhập, hoặc bạn có thể nhập:

| Vai trò | Tên đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` | `123456` | Toàn quyền quản trị: Dashboard doanh thu, CRUD thực đơn, quản lý bàn ăn, duyệt đặt bàn, lịch sử đơn |
| **Nhân viên (Staff / POS)** | `staff` | `123456` | Thao tác POS: Xem sơ đồ bàn, mở bàn gọi món, gửi bếp, thanh toán hóa đơn |
| **Khách hàng (Customer)** | *Không cần đăng nhập* | *--* | Xem menu, đặt bàn online, gọi món vào giỏ, tra cứu đơn hàng |

---

## 🛠️ 4. Cấu Trúc Mã Nguồn

```
Project3/
├── backend/                       # Java Spring Boot 3
│   ├── src/main/java/com/restaurant/management/
│   │   ├── config/                # SecurityConfig, JwtTokenProvider, DataInitializer, OpenApiConfig
│   │   ├── controller/            # REST Controllers (Auth, Menu, Table, Reservation, Order, Stats)
│   │   ├── dto/                   # Data Transfer Objects & Request payloads
│   │   ├── entity/                # JPA Entities (User, Category, MenuItem, RestaurantTable, Order, Reservation)
│   │   ├── exception/             # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/            # Spring Data JPA Repositories
│   │   └── service/               # Business Services
│   ├── src/main/resources/
│   │   ├── application.properties # Cấu hình mặc định (H2 In-memory + file)
│   │   └── application-mysql.properties # Cấu hình sẵn sàng cho MySQL
│   └── build.gradle
│
├── frontend/                      # ReactJS + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/                   # Axios API clients
│   │   ├── components/            # Navbar, Footer, LoginModal, CartDrawer, VietQrModal
│   │   ├── context/               # AuthContext, CartContext
│   │   ├── pages/
│   │   │   ├── customer/          # CustomerHome, MenuPage, ReservationPage, OrderTrackingPage
│   │   │   ├── pos/               # TableMapPage, OrderPosPage
│   │   │   └── admin/             # AdminDashboard, MenuManagement, TableManagement, ReservationManagement, OrderHistory
│   │   ├── App.jsx                # Router & Provider Layout
│   │   └── main.jsx
│   └── package.json
│
└── docs/
    └── BAO_CAO_PROJECT_3.md       # Báo cáo kỹ thuật Project 3 chi tiết 5 chương chuẩn HUST
```

---

## 📑 5. Báo Cáo Đồ Án
Xem chi tiết báo cáo đồ án Project 3 chuẩn đề cương SoICT/HUST tại thư mục `docs/BAO_CAO_PROJECT_3.md`.
