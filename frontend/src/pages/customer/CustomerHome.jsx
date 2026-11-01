import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChefHat, 
  Wine, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

export default function CustomerHome() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Tinh Hoa Ẩm Thực Việt Nam Đương Đại
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Hương Vị Trọn Vẹn, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500">
                  Khoảnh Khắc Đáng Nhớ
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Chào mừng bạn đến với Golden Spoon. Chúng tôi tự hào mang đến trải nghiệm ẩm thực thượng hạng với nguồn nguyên liệu tươi sống mỗi ngày cùng không gian nhà hàng sang trọng, ấm cúng.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/reservation"
                  className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Calendar className="w-4 h-4" />
                  Đặt Bàn Trực Tuyến
                </Link>
                <Link
                  to="/menu"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm shadow-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <Utensils className="w-4 h-4 text-amber-600" />
                  Khám Phá Thực Đơn
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Thực phẩm tươi sạch</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">50+</p>
                  <p className="text-xs text-slate-500">Món ăn phong phú</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4.9 / 5</p>
                  <p className="text-xs text-slate-500">Đánh giá khách hàng</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Mosaic */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-amber-900/10 border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000"
                    alt="Ẩm thực nhà hàng"
                    className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-xs font-bold uppercase tracking-wider text-white">
                      Món Đặc Tuyển
                    </span>
                    <h3 className="text-xl font-bold mt-2">Bò Bít Tết Sốt Tiêu & Nem Rán Truyền Thống</h3>
                    <p className="text-xs text-slate-200 mt-1">Sự kết hợp hoàn hảo giữa ẩm thực truyền thống và hiện đại.</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Bếp Trưởng Điều Hành</p>
                    <p className="text-sm font-bold text-slate-900">15+ Năm Kinh Nghiệm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Dịch Vụ Chuẩn 5 Sao</h2>
          <p className="text-sm text-slate-600 mt-2">
            Mọi quy trình từ tiếp nhận đặt bàn, phục vụ món ăn đến thanh toán đều được quản lý số hóa thông minh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Đặt Bàn Dễ Dàng & Linh Hoạt</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tự do lựa chọn khu vực yêu thích: Sân vườn thoáng đãng, Phòng lạnh gia đình hay Không gian VIP sang trọng cho tiệc liên hoan.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gọi Món Trực Tuyến & Tại Bàn</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Khám phá thực đơn trực quan với hình ảnh chân thực, tra cứu món chay/cay, thêm ghi chú cho đầu bếp và đặt món trước khi đến.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Thanh Toán VietQR & POS Tức Thì</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tích hợp hệ thống quản lý POS bán hàng tại bàn hiện đại, hỗ trợ chuyển khoản ngân hàng QR Code tự động chính xác từng đồng.
            </p>
          </div>
        </div>
      </section>

      {/* Ambiance showcase */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Không Gian Kiến Trúc</span>
              <h2 className="text-3xl font-extrabold text-white">Ấm Cúng, Thanh Lịch & Đẳng Cấp</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Golden Spoon sở hữu không gian mở kết hợp cây xanh tự nhiên và phong cách hiện đại. Cho dù là bữa tối lãng mạn 2 người, buổi gặp gỡ đối tác hay tiệc sinh nhật đại gia đình, chúng tôi đều có không gian hoàn hảo dành cho bạn.
              </p>
              <div className="pt-2">
                <Link
                  to="/reservation"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Đặt Chỗ Ngay Hôm Nay
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"
                alt="Không gian nhà hàng"
                className="rounded-2xl h-44 w-full object-cover shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500"
                alt="Bàn tiệc VIP"
                className="rounded-2xl h-44 w-full object-cover shadow-lg mt-6"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
