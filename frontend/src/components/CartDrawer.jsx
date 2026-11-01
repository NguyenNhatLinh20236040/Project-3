import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/orderApi';
import { tableApi } from '../api/tableApi';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Utensils, 
  Package, 
  Send,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalAmount, 
    totalItemsCount,
    isDrawerOpen, 
    setIsDrawerOpen 
  } = useCart();

  const [orderType, setOrderType] = useState('DINE_IN');
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isDrawerOpen) {
      tableApi.getTables()
        .then((res) => {
          setTables(res || []);
          if (res && res.length > 0 && !selectedTableId) {
            setSelectedTableId(res[0].id);
          }
        })
        .catch((err) => console.error('Failed to load tables', err));
    }
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError('');
    setLoading(true);

    try {
      const payload = {
        tableId: orderType === 'DINE_IN' ? Number(selectedTableId) : null,
        orderType,
        note: `Khách: ${customerName || 'Vãng lai'} (${customerPhone || 'Không có SĐT'}) - Ghi chú: ${orderNote}`,
        serverName: 'Đặt món trực tuyến',
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
          note: i.note || '',
        })),
      };

      const res = await orderApi.createCustomerOrder(payload);
      setSuccessOrder(res);
      clearCart();
    } catch (err) {
      setError(err.message || 'Gửi đơn hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    setSuccessOrder(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base">Giỏ Món Của Bạn</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                {totalItemsCount} món
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen */}
          {successOrder ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Đặt Món Thành Công!</h4>
              <p className="text-xs text-slate-600 max-w-xs">
                Đơn hàng của bạn đã được chuyển tới nhà bếp. Mã đơn hàng của bạn là:
              </p>
              <div className="px-4 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-base text-amber-800">
                {successOrder.orderNumber}
              </div>
              <div className="text-xs text-slate-500">
                Tổng giá trị: <strong className="text-slate-900">{Number(successOrder.finalAmount).toLocaleString('vi-VN')} đ</strong>
              </div>
              <div className="flex flex-col w-full gap-2 pt-4">
                <Link
                  to={`/tracking?query=${successOrder.orderNumber}`}
                  onClick={handleClose}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Theo Dõi Tiến Độ Đơn Hàng
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Tiếp Tục Xem Thực Đơn
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                    <Utensils className="w-12 h-12 text-slate-300" />
                    <p className="text-sm font-medium">Giỏ món đang trống</p>
                    <p className="text-xs">Hãy chọn những món ăn ngon trong thực đơn nhé!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60"
                    >
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-xs font-semibold text-amber-600 mt-0.5">
                          {Number(item.price).toLocaleString('vi-VN')} đ
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1.5 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Xóa món"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order form & Checkout button */}
              {items.length > 0 && (
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  {/* Dine in vs Takeaway */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderType('DINE_IN')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        orderType === 'DINE_IN'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" /> Dùng Tại Bàn
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('TAKEAWAY')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        orderType === 'TAKEAWAY'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" /> Mang Về
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-2">
                    {orderType === 'DINE_IN' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Chọn số bàn của bạn:
                        </label>
                        <select
                          value={selectedTableId}
                          onChange={(e) => setSelectedTableId(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        >
                          {tables.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.tableNumber} ({t.zone} - {t.capacity} chỗ) - Trạng thái: {t.status === 'AVAILABLE' ? 'Trống' : 'Có khách'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Họ tên của bạn"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Ghi chú món (VD: ít đường, không cay...)"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Total & Submit */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">{totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900 mb-3">
                      <span>Tổng thanh toán:</span>
                      <span className="text-amber-600 text-base">{totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={loading || items.length === 0}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {loading ? 'Đang gửi đơn...' : 'Xác Nhận Gọi Món'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
