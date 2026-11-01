import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../api/reservationApi';
import { tableApi } from '../../api/tableApi';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  User, 
  Mail, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReservationPage() {
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    guestCount: 2,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '18:30',
    selectedZone: 'Tầng 1 - Sân Vườn',
    selectedTableId: '',
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successReservation, setSuccessReservation] = useState(null);

  useEffect(() => {
    tableApi.getTables(formData.selectedZone)
      .then((res) => {
        setTables(res || []);
      })
      .catch((err) => console.error('Failed to load tables', err));
  }, [formData.selectedZone]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const reservationDateTime = `${formData.reservationDate}T${formData.reservationTime}:00`;
      
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        guestCount: Number(formData.guestCount),
        reservationTime: reservationDateTime,
        tableId: formData.selectedTableId ? Number(formData.selectedTableId) : null,
        specialRequests: formData.specialRequests,
      };

      const res = await reservationApi.createReservation(payload);
      setSuccessReservation(res);
    } catch (err) {
      setError(err.message || 'Đặt bàn không thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {successReservation ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Yêu Cầu Đã Được Tiếp Nhận
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Đặt Bàn Thành Công!</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Cảm ơn quý khách <strong>{successReservation.customerName}</strong>. Nhà hàng Golden Spoon đã ghi nhận thông tin đặt bàn của quý khách.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã đơn đặt bàn:</span>
              <span className="font-mono font-bold text-amber-700">RES-{successReservation.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số lượng khách:</span>
              <span className="font-semibold text-slate-900">{successReservation.guestCount} người</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thời gian:</span>
              <span className="font-semibold text-slate-900">
                {new Date(successReservation.reservationTime).toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bàn được chọn:</span>
              <span className="font-semibold text-slate-900">
                {successReservation.tableNumber ? `${successReservation.tableNumber} (${successReservation.zone})` : 'Nhà hàng tự xếp'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                Chờ nhà hàng xác nhận
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/tracking?phone=${formData.customerPhone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              Tra Cứu Trạng Thái Đặt Bàn
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSuccessReservation(null);
                setFormData({
                  ...formData,
                  customerName: '',
                  customerPhone: '',
                  specialRequests: '',
                });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
            >
              Đặt Bàn Khác
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-left">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-8 text-white">
            <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Dịch Vụ Tiếp Đón Chu Đáo
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Đặt Bàn Trực Tuyến</h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              Vui lòng điền thông tin bên dưới để nhà hàng giữ chỗ và chuẩn bị đón tiếp quý khách chu đáo nhất.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Thông tin khách hàng */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" /> Thông Tin Người Đặt
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email nhận xác nhận</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Chi tiết đặt bàn */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-600" /> Thời Gian & Số Lượng Khách
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày dùng bữa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    name="reservationDate"
                    value={formData.reservationDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giờ đến <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    name="reservationTime"
                    value={formData.reservationTime}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số người <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Khu vực & Chọn bàn cụ thể */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" /> Khu Vực & Bàn Ăn
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khu vực ưu tiên</label>
                  <select
                    name="selectedZone"
                    value={formData.selectedZone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="Tầng 1 - Sân Vườn">🌿 Tầng 1 - Sân Vườn (Thoáng đãng, cây xanh)</option>
                    <option value="Tầng 2 - Máy Lạnh">❄️ Tầng 2 - Máy Lạnh (Ấm cúng, gia đình)</option>
                    <option value="Phòng VIP">👑 Phòng VIP (Riêng tư, sang trọng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn bàn cụ thể (Tùy chọn)</label>
                  <select
                    name="selectedTableId"
                    value={formData.selectedTableId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="">-- Để nhà hàng tự sắp xếp bàn phù hợp --</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id} disabled={t.status === 'OCCUPIED'}>
                        {t.tableNumber} ({t.capacity} chỗ) - Trạng thái: {t.status === 'AVAILABLE' ? 'Trống' : t.status === 'RESERVED' ? 'Đã đặt' : 'Đang phục vụ'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Yêu cầu đặc biệt</label>
                <textarea
                  name="specialRequests"
                  rows="3"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Ví dụ: Trang trí sinh nhật, ghế ăn cho em bé, vị trí sát cửa sổ..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Đang gửi yêu cầu đặt bàn...' : 'Xác Nhận Đặt Bàn Ngay'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
