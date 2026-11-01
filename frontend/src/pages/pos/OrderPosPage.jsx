import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { menuApi } from '../../api/menuApi';
import { tableApi } from '../../api/tableApi';
import { orderApi } from '../../api/orderApi';
import VietQrModal from '../../components/VietQrModal';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle, 
  Printer, 
  Clock, 
  Utensils, 
  Percent, 
  Send,
  AlertCircle
} from 'lucide-react';

export default function OrderPosPage() {
  const [searchParams] = useSearchParams();
  const initialTableId = searchParams.get('tableId');
  const initialOrderId = searchParams.get('orderId');

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [keyword, setKeyword] = useState('');
  
  const [tables, setTables] = useState([]);
  const [currentTableId, setCurrentTableId] = useState(initialTableId || '');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [serverNote, setServerNote] = useState('');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paidOrderInfo, setPaidOrderInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategoriesAndMenu();
    loadTables();
  }, []);

  useEffect(() => {
    if (currentTableId) {
      loadActiveOrder(currentTableId);
    }
  }, [currentTableId]);

  const loadCategoriesAndMenu = async () => {
    try {
      const [cats, items] = await Promise.all([
        menuApi.getCategories(),
        menuApi.getMenuItems(),
      ]);
      setCategories(cats || []);
      setMenuItems(items || []);
    } catch (err) {
      console.error('Failed to load menu', err);
    }
  };

  const loadTables = async () => {
    try {
      const res = await tableApi.getTables();
      setTables(res || []);
      if (!currentTableId && res && res.length > 0) {
        setCurrentTableId(res[0].id);
      }
    } catch (err) {
      console.error('Failed to load tables', err);
    }
  };

  const loadActiveOrder = async (tableId) => {
    try {
      const order = await orderApi.getActiveOrderByTable(tableId);
      setCurrentOrder(order);
      setDiscountPercent(order.discountPercent || 0);
      setCartItems(
        order.items?.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.menuItemName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
          status: item.status,
          existingId: item.id,
        })) || []
      );
    } catch (err) {
      // No active order, start clean
      setCurrentOrder(null);
      setCartItems([]);
      setDiscountPercent(0);
    }
  };

  const handleAddItem = (dish) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === dish.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * Number(i.price) }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          subtotal: Number(dish.price),
          status: 'QUEUED',
        },
      ];
    });
  };

  const handleUpdateQuantity = (menuItemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0
              ? { ...i, quantity: newQty, subtotal: newQty * Number(i.price) }
              : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (menuItemId) => {
    setCartItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalAmount = subtotal - discountAmount;

  // Send / Save order to Kitchen
  const handleSaveOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setError('');

    try {
      if (currentOrder) {
        // Add new items
        const newItemsOnly = cartItems.filter((i) => !i.existingId);
        if (newItemsOnly.length > 0) {
          const payload = newItemsOnly.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          }));
          await orderApi.addItems(currentOrder.id, payload);
        }
        await loadActiveOrder(currentTableId);
        alert('Đã cập nhật đơn hàng và gửi thông báo nhà bếp!');
      } else {
        // Create new order
        const payload = {
          tableId: Number(currentTableId),
          orderType: 'DINE_IN',
          note: serverNote,
          serverName: 'Nhân viên POS',
          items: cartItems.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        };
        const newOrder = await orderApi.createOrder(payload);
        setCurrentOrder(newOrder);
        alert('Tạo đơn gọi món tại bàn thành công!');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu đơn');
    } finally {
      setLoading(false);
    }
  };

  // Checkout handling
  const handleProcessCheckout = async (paymentMethod) => {
    if (!currentOrder) {
      alert('Vui lòng bấm [Gửi Bếp & Lưu Đơn] trước khi thanh toán!');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const checkoutPayload = {
        paymentMethod,
        discountPercent: Number(discountPercent),
        note: serverNote,
      };

      const paidOrder = await orderApi.checkout(currentOrder.id, checkoutPayload);
      setPaidOrderInfo(paidOrder);
      setPaymentSuccess(true);
      setCurrentOrder(null);
      setCartItems([]);
    } catch (err) {
      setError(err.message || 'Thanh toán thất bại');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchCat = !selectedCategory || item.categoryId === selectedCategory;
    const matchKey = !keyword || item.name.toLowerCase().includes(keyword.toLowerCase());
    return matchCat && matchKey;
  });

  const selectedTableObj = tables.find((t) => String(t.id) === String(currentTableId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      {/* Title & Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-blue-600" />
            Hệ Thống Bán Hàng & Thu Ngân (POS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gọi món nhanh tại bàn, quản lý thực đơn phục vụ và thanh toán hóa đơn
          </p>
        </div>

        <button
          onClick={() => navigate('/pos/tables')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
        >
          ← Xem Sơ Đồ Bàn
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Success Invoice View */}
      {paymentSuccess && paidOrderInfo ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-lg mx-auto text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Thanh Toán Hoàn Tất!</h2>
            <p className="text-xs text-slate-500 mt-1">Bàn đã được giải phóng sang trạng thái Trống</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
            <div className="flex justify-between font-mono font-bold text-slate-800">
              <span>Hóa đơn:</span>
              <span>{paidOrderInfo.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bàn:</span>
              <span className="font-semibold">{paidOrderInfo.tableNumber} ({paidOrderInfo.zone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phương thức:</span>
              <span className="font-bold text-blue-600">
                {paidOrderInfo.paymentMethod === 'BANK_TRANSFER_QR' ? 'Chuyển khoản VietQR' : paidOrderInfo.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giảm giá:</span>
              <span className="text-emerald-600 font-semibold">{paidOrderInfo.discountPercent}%</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Tổng thanh toán:</span>
              <span className="text-amber-600">{Number(paidOrderInfo.finalAmount).toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" /> In Hóa Đơn
            </button>
            <button
              onClick={() => {
                setPaymentSuccess(false);
                setPaidOrderInfo(null);
                loadTables();
              }}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
            >
              Tiếp Tục Bán Hàng
            </button>
          </div>
        </div>
      ) : (
        /* POS Layout: Left catalog & Right order cart */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Menu Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm món ăn nhanh..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredMenuItems.map((dish) => (
                <button
                  key={dish.id}
                  onClick={() => handleAddItem(dish)}
                  className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col justify-between group h-44"
                >
                  <img
                    src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
                    alt={dish.name}
                    className="w-full h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-1.5">
                      {dish.name}
                    </h4>
                    <p className="text-xs font-extrabold text-amber-600 mt-0.5">
                      {Number(dish.price).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <div className="w-full py-1 rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-700 text-[10px] font-bold text-center transition-colors">
                    + Thêm vào bàn
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Order Cart & Bill Checkout (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-5 flex flex-col justify-between space-y-4">
            {/* Header: Select table */}
            <div className="space-y-3 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Chọn bàn phục vụ:</span>
                {currentOrder && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[11px] font-bold">
                    {currentOrder.orderNumber}
                  </span>
                )}
              </div>

              <select
                value={currentTableId}
                onChange={(e) => setCurrentTableId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tableNumber} - {t.zone} ({t.capacity} chỗ) [{t.status === 'AVAILABLE' ? 'Trống' : 'Có khách'}]
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto max-h-72 space-y-2 pr-1">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Chưa có món nào được thêm vào bàn này. Hãy click vào món bên trái!
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-amber-600 font-semibold">
                        {Number(item.price).toLocaleString('vi-VN')} đ
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItemId, -1)}
                          className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-800 text-[11px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItemId, 1)}
                          className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-slate-800 w-16 text-right">
                        {Number(item.subtotal).toLocaleString('vi-VN')} đ
                      </span>

                      <button
                        onClick={() => handleRemoveItem(item.menuItemId)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculation summary & Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              {/* Discount selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1 font-semibold">
                  <Percent className="w-3.5 h-3.5 text-amber-600" /> Chiết khấu / Giảm giá:
                </span>
                <select
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-xs"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={15}>15%</option>
                  <option value={20}>20%</option>
                </select>
              </div>

              {/* Subtotal & Final */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính ({cartItems.reduce((s, i) => s + i.quantity, 0)} món):</span>
                  <span>{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá ({discountPercent}%):</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Cần thanh toán:</span>
                  <span className="text-amber-600">{finalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleSaveOrder}
                  disabled={loading || cartItems.length === 0}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi Bếp & Lưu
                </button>

                <button
                  onClick={() => setIsQrModalOpen(true)}
                  disabled={loading || !currentOrder}
                  className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <QrCode className="w-3.5 h-3.5" /> VietQR CK
                </button>
              </div>

              {/* Cash & Card quick checkout */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleProcessCheckout('CASH')}
                  disabled={loading || !currentOrder}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Banknote className="w-3.5 h-3.5" /> Thu Tiền Mặt
                </button>
                <button
                  onClick={() => handleProcessCheckout('CARD')}
                  disabled={loading || !currentOrder}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Quẹt Thẻ POS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VietQR Popup */}
      <VietQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        amount={finalAmount}
        orderNumber={currentOrder?.orderNumber}
        onConfirmPayment={() => handleProcessCheckout('BANK_TRANSFER_QR')}
      />
    </div>
  );
}
