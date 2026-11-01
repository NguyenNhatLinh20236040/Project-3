import React, { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import { 
  Search, 
  Eye, 
  Printer, 
  FileText, 
  Calendar, 
  DollarSign, 
  X,
  RefreshCw 
} from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const statusParam = selectedStatus === 'ALL' ? null : selectedStatus;
      const data = await orderApi.getOrders(statusParam);
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Chờ phục vụ</span>;
      case 'PREPARING':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Đang nấu</span>;
      case 'SERVED':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">Đã lên món</span>;
      case 'PAID':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Đã thanh toán</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">Đã hủy</span>;
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
            <FileText className="w-6 h-6 text-purple-600" />
            Lịch Sử Đơn Hàng & Hóa Đơn
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tra cứu tất cả đơn gọi món tại bàn, doanh thu hóa đơn và hình thức thanh toán
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'PAID', 'PREPARING', 'SERVED', 'PENDING', 'CANCELLED'].map((st) => (
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
            {st === 'PAID' && '💳 Đã thanh toán'}
            {st === 'PREPARING' && '👨‍🍳 Đang nấu'}
            {st === 'SERVED' && '🍽️ Đã lên món'}
            {st === 'PENDING' && '⏳ Chờ bếp'}
            {st === 'CANCELLED' && '❌ Đã hủy'}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Mã hóa đơn</th>
                <th className="p-4">Bàn / Khu vực</th>
                <th className="p-4">Thời gian tạo</th>
                <th className="p-4">Số lượng món</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Hình thức TT</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Đang tải lịch sử đơn...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Không có đơn hàng nào</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4">
                      {ord.tableNumber ? (
                        <span className="font-semibold text-slate-800">{ord.tableNumber} ({ord.zone})</span>
                      ) : (
                        <span className="text-slate-400">Mang về</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(ord.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {ord.items?.reduce((s, i) => s + i.quantity, 0) || 0} món
                    </td>
                    <td className="p-4 font-extrabold text-amber-600">
                      {Number(ord.finalAmount).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4">
                      {ord.paymentMethod ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                          {ord.paymentMethod === 'BANK_TRANSFER_QR' ? 'VietQR' : ord.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ'}
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa TT</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-purple-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Hóa Đơn Chi Tiết</h3>
                <span className="font-mono text-purple-200 text-xs">{viewingOrder.orderNumber}</span>
              </div>
              <button onClick={() => setViewingOrder(null)}>
                <X className="w-5 h-5 text-purple-200 hover:text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Bàn phục vụ:</span>
                  <strong className="text-slate-900">{viewingOrder.tableNumber || 'Mang về'} ({viewingOrder.zone})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Thời gian:</span>
                  <strong className="text-slate-900">{new Date(viewingOrder.createdAt).toLocaleString('vi-VN')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Trạng thái:</span>
                  {getStatusBadge(viewingOrder.status)}
                </div>
                <div>
                  <span className="text-slate-500 block">Phương thức:</span>
                  <strong className="text-blue-600">{viewingOrder.paymentMethod || 'Chưa thanh toán'}</strong>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Chi tiết món ăn:</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {viewingOrder.items?.map((item) => (
                    <div key={item.id} className="p-2.5 flex items-center justify-between bg-white">
                      <div>
                        <p className="font-semibold text-slate-900">{item.menuItemName}</p>
                        <p className="text-[10px] text-slate-400">
                          {Number(item.price).toLocaleString('vi-VN')} đ × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800">
                        {Number(item.subtotal).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính:</span>
                  <span>{Number(viewingOrder.totalAmount).toLocaleString('vi-VN')} đ</span>
                </div>
                {viewingOrder.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá ({viewingOrder.discountPercent}%):</span>
                    <span>-{((Number(viewingOrder.totalAmount) * viewingOrder.discountPercent) / 100).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-amber-600">{Number(viewingOrder.finalAmount).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> In Hóa Đơn
                </button>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
