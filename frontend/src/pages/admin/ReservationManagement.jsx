import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../api/reservationApi';
import { tableApi } from '../../api/tableApi';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Phone, 
  User, 
  Filter,
  RefreshCw 
} from 'lucide-react';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
    tableApi.getTables().then(setTables).catch(console.error);
  }, [selectedStatus]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const statusParam = selectedStatus === 'ALL' ? null : selectedStatus;
      const data = await reservationApi.getReservations(statusParam);
      setReservations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, tableId = null) => {
    try {
      await reservationApi.updateStatus(id, status, tableId);
      loadReservations();
    } catch (err) {
      alert('Cập nhật trạng thái thất bại: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Đã duyệt</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Khách đã đến</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">Đã hủy</span>;
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Quản Lý Lịch Đặt Bàn
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Duyệt yêu cầu đặt bàn của khách hàng, phân phối bàn ăn và theo dõi giờ đón khách
          </p>
        </div>

        <button
          onClick={loadReservations}
          className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === st
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' && 'Tất cả đơn'}
            {st === 'PENDING' && '⏳ Chờ duyệt'}
            {st === 'CONFIRMED' && '✅ Đã duyệt'}
            {st === 'COMPLETED' && '🎉 Đã đón khách'}
            {st === 'CANCELLED' && '❌ Đã hủy'}
          </button>
        ))}
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Thời gian đến</th>
                <th className="p-4">Số lượng</th>
                <th className="p-4">Bàn sắp xếp</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Ghi chú</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Đang tải lịch đặt bàn...</td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Không có đơn đặt bàn nào</td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-700">
                      RES-{res.id}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{res.customerName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {res.customerPhone}
                      </p>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {new Date(res.reservationTime).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {res.guestCount} người
                    </td>
                    <td className="p-4">
                      {res.tableNumber ? (
                        <span className="font-bold text-slate-900">{res.tableNumber} ({res.zone})</span>
                      ) : (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleUpdateStatus(res.id, 'CONFIRMED', Number(e.target.value));
                            }
                          }}
                          className="px-2 py-1 text-[11px] border border-purple-300 rounded-lg bg-purple-50 text-purple-900 font-semibold focus:outline-hidden"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Chọn xếp bàn --</option>
                          {tables.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.tableNumber} ({t.zone}) - {t.capacity} chỗ
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="p-4 text-slate-400 italic max-w-xs truncate">
                      {res.specialRequests || '--'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {res.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'CONFIRMED', res.tableId)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] shadow-xs"
                          >
                            Duyệt
                          </button>
                        )}
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'COMPLETED', res.tableId)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow-xs"
                          >
                            Đã đến
                          </button>
                        )}
                        {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'CANCELLED')}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hủy đơn"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
