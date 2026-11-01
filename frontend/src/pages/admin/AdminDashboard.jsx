import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../../api/statsApi';
import { 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Grid, 
  TrendingUp, 
  Award, 
  Plus, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = stats?.recentRevenue?.reduce((max, r) => Math.max(max, Number(r.revenue) || 0), 1000000) || 1000000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Bảng Quản Trị & Thống Kê
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng quan doanh thu, tình hình bàn ăn và các món bán chạy nhất
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStats}
            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới dữ liệu
          </button>
          <Link
            to="/admin/menu"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Quản Lý Thực Đơn
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải báo cáo thống kê...</div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Today Revenue */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Doanh Thu Hôm Nay</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {Number(stats.todayRevenue || 0).toLocaleString('vi-VN')} đ
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">
                  Cập nhật thời gian thực
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Active Orders */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Đơn Đang Phục Vụ</p>
                <h3 className="text-xl font-extrabold text-blue-600 mt-1">
                  {stats.activeOrdersCount || 0} đơn
                </h3>
                <Link to="/pos/tables" className="text-[10px] text-blue-600 hover:underline font-semibold mt-0.5 inline-block">
                  Xem trên sơ đồ bàn →
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            {/* Pending Reservations */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Đặt Bàn Chờ Duyệt</p>
                <h3 className="text-xl font-extrabold text-amber-600 mt-1">
                  {stats.pendingReservationsCount || 0} lượt
                </h3>
                <Link to="/admin/reservations" className="text-[10px] text-amber-600 hover:underline font-semibold mt-0.5 inline-block">
                  Duyệt ngay →
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            {/* Tables Occupancy */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Tỷ Lệ Lấp Đầy Bàn</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {stats.occupiedTablesCount} / {stats.totalTablesCount}
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 inline-block">
                  {Math.round(((stats.occupiedTablesCount || 0) / (stats.totalTablesCount || 1)) * 100)}% công suất
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Grid className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Revenue Chart (7 days) & Top Selling Items */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Bar Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
                  </h3>
                  <p className="text-xs text-slate-500">Thống kê theo đơn hàng đã thanh toán</p>
                </div>
              </div>

              {/* Chart visualization */}
              <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {stats.recentRevenue?.map((item, idx) => {
                  const rev = Number(item.revenue) || 0;
                  const heightPercent = maxRevenue > 0 ? Math.max((rev / maxRevenue) * 100, 8) : 8;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md shadow-md text-center pointer-events-none whitespace-nowrap">
                        <p className="font-bold">{rev.toLocaleString('vi-VN')} đ</p>
                        <p className="text-[9px] text-slate-400">{item.orderCount} đơn</p>
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-xl group-hover:from-purple-500 group-hover:to-indigo-400 transition-all shadow-xs"
                      />

                      {/* Label */}
                      <span className="text-[11px] font-semibold text-slate-600">{item.date}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>Trục đứng: Doanh thu (VND)</span>
                <span>Trục ngang: Ngày trong tuần</span>
              </div>
            </div>

            {/* Top 5 Selling Dishes (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Top 5 Món Ăn Bán Chạy Nhất
                  </h3>
                  <p className="text-xs text-slate-500">Món được khách hàng yêu thích nhất</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {stats.topSellingItems?.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">Chưa có dữ liệu bán hàng</p>
                ) : (
                  stats.topSellingItems?.map((item, index) => (
                    <div
                      key={item.menuItemId}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          index === 0 ? 'bg-amber-500 text-white shadow-xs' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-amber-800 text-amber-100' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{item.menuItemName}</p>
                          <p className="text-[11px] text-slate-500">Đã bán: <strong className="text-purple-600">{item.quantitySold}</strong> phần</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {Number(item.totalRevenue).toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
