import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reservationApi } from '../../api/reservationApi';
import { orderApi } from '../../api/orderApi';
import { 
  Search, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  Utensils, 
  MapPin, 
  Phone 
} from 'lucide-react';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || searchParams.get('phone') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('RESERVATION'); // 'RESERVATION' | 'ORDER'
  const [reservations, setReservations] = useState([]);
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuery) {
      if (initialQuery.startsWith('ORD-')) {
        setActiveTab('ORDER');
        handleSearchOrder(initialQuery);
      } else {
        setActiveTab('RESERVATION');
        handleSearchReservation(initialQuery);
      }
    }
  }, [initialQuery]);

  const handleSearchReservation = async (phone) => {
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setReservations([]);
    try {
      const data = await reservationApi.lookupByPhone(phone.trim());
      if (!data || data.length === 0) {
        setError(`Không tìm thấy đơn đặt bàn nào với số điện thoại: ${phone}`);
      } else {
        setReservations(data);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tra cứu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOrder = async (orderNum) => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setError('');
    setOrderResult(null);
    try {
      const data = await orderApi.lookupOrder(orderNum.trim());
      setOrderResult(data);
    } catch (err) {
      setError(`Không tìm thấy đơn gọi món với mã: ${orderNum}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'RESERVATION') {
      handleSearchReservation(searchTerm);
    } else {
      handleSearchOrder(searchTerm);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">⏳ Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">✅ Đã xác nhận</span>;
      case 'PREPARING':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">👨‍🍳 Đang nấu</span>;
      case 'SERVED':
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">🍽️ Đã lên món</span>;
      case 'PAID':
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">🎉 Hoàn tất</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">❌ Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tra Cứu Trực Tuyến</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi trạng thái đơn đặt bàn hoặc tiến độ chuẩn bị món ăn theo thời gian thực
        </p>

        {/* Tab switch */}
        <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl mt-6">
          <button
            onClick={() => {
              setActiveTab('RESERVATION');
              setError('');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'RESERVATION' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tra Cứu Đặt Bàn (Bằng SĐT)
          </button>
          <button
            onClick={() => {
              setActiveTab('ORDER');
              setError('');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ORDER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tra Cứu Đơn Món (Bằng Mã Đơn)
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'RESERVATION' ? 'Nhập số điện thoại đặt bàn...' : 'Ví dụ: ORD-20261028-0001'}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang tra...' : 'Tra cứu'}
          </button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs max-w-lg mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reservation Results */}
      {activeTab === 'RESERVATION' && reservations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Kết quả đặt bàn ({reservations.length} đơn):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => (
              <div key={res.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-700">RES-{res.id}</span>
                  {getStatusBadge(res.status)}
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong>Khách hàng:</strong> {res.customerName}</p>
                  <p><strong>Thời gian:</strong> {new Date(res.reservationTime).toLocaleString('vi-VN')}</p>
                  <p><strong>Số lượng:</strong> {res.guestCount} người</p>
                  <p><strong>Bàn xếp:</strong> {res.tableNumber ? `${res.tableNumber} (${res.zone})` : 'Chờ sắp xếp'}</p>
                  {res.specialRequests && (
                    <p className="p-2 bg-slate-50 rounded-lg text-slate-500 italic">"{res.specialRequests}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Results */}
      {activeTab === 'ORDER' && orderResult && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400">Mã đơn gọi món:</span>
              <h3 className="font-mono font-bold text-base text-slate-900">{orderResult.orderNumber}</h3>
            </div>
            {getStatusBadge(orderResult.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <p className="text-slate-400">Vị trí phục vụ:</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {orderResult.tableNumber ? `${orderResult.tableNumber} - ${orderResult.zone}` : 'Mang về (Takeaway)'}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Thời gian tạo:</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {new Date(orderResult.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">Danh sách món ăn:</h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {orderResult.items?.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between text-xs bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-amber-600 w-5">x{item.quantity}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.menuItemName}</p>
                      {item.note && <p className="text-[10px] text-slate-400">Ghi chú: {item.note}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{Number(item.subtotal).toLocaleString('vi-VN')} đ</p>
                    <span className="text-[10px] font-medium text-slate-500">
                      {item.status === 'QUEUED' ? 'Chờ nấu' : item.status === 'COOKING' ? 'Đang nấu' : 'Đã ra bàn'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
            <span className="text-lg font-extrabold text-amber-600">
              {Number(orderResult.finalAmount).toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
