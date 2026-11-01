import React from 'react';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Golden Spoon</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống nhà hàng ẩm thực Việt Nam kết hợp phong cách hiện đại. Mang đến trải nghiệm ẩm thực tinh hoa và tiện ích đặt bàn, gọi món trực tuyến.
            </p>
            <div className="text-xs text-amber-500 font-semibold">
              🎓 Đồ án tốt nghiệp / Project 3 (IT3940) - HUST
            </div>
          </div>

          {/* Quick info */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Liên Hệ</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" /> Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" /> Hotline: 1900 8888 (09:00 - 22:30)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" /> contact@goldenspoon.vn
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Giờ Mở Cửa</h4>
            <div className="space-y-1.5 text-xs">
              <p className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Thứ Hai - Chủ Nhật
              </p>
              <p>Trưa: 10:30 - 14:00</p>
              <p>Tối: 17:30 - 22:30</p>
              <p className="text-amber-400 text-[11px] mt-2">Phục vụ xuyên lễ tết</p>
            </div>
          </div>

          {/* Tech stack */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Công Nghệ Sử Dụng</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]">Java Spring Boot 3</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]">ReactJS 19 + Vite</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]">Tailwind CSS</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]">Spring Security + JWT</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]">H2 & MySQL Database</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]">OpenAPI / Swagger</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Golden Spoon Restaurant System. Project III - HUST.</p>
          <p className="text-slate-400">Thiết kế chuẩn phân hệ Khách hàng - Phục vụ/POS - Quản trị viên.</p>
        </div>
      </div>
    </footer>
  );
}
