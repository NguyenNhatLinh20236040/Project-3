import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableApi } from '../../api/tableApi';
import { orderApi } from '../../api/orderApi';
import { 
  Grid, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  DollarSign, 
  FileText,
  Utensils
} from 'lucide-react';

export default function TableMapPage() {
  const [tables, setTables] = useState([]);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadTables();
    const interval = setInterval(loadTables, 10000); // Polling every 10s for real-time table map
    return () => clearInterval(interval);
  }, []);

  const loadTables = async () => {
    try {
      const data = await tableApi.getTables();
      setTables(data || []);
    } catch (err) {
      console.error('Failed to load tables', err);
    } finally {
      setLoading(false);
    }
  };

  const zones = ['ALL', ...new Set(tables.map((t) => t.zone))];
  const filteredTables = selectedZone === 'ALL' ? tables : tables.filter((t) => t.zone === selectedZone);

  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const reservedCount = tables.filter((t) => t.status === 'RESERVED').length;

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    if (table.status === 'OCCUPIED') {
      setLoadingOrder(true);
      try {
        const order = await orderApi.getActiveOrderByTable(table.id);
        setActiveOrder(order);
      } catch (err) {
        setActiveOrder(null);
      } finally {
        setLoadingOrder(false);
      }
    } else {
      setActiveOrder(null);
    }
  };

  const handleOpenNewOrder = (table) => {
    navigate(`/pos/order?tableId=${table.id}`);
  };

  const handleGoToCheckout = (table, orderId) => {
    navigate(`/pos/order?tableId=${table.id}&orderId=${orderId}`);
  };

  const handleUpdateStatus = async (tableId, newStatus) => {
    try {
      await tableApi.updateStatus(tableId, newStatus);
      loadTables();
      if (selectedTable && selectedTable.id === tableId) {
        setSelectedTable({ ...selectedTable, status: newStatus });
      }
    } catch (err) {
      alert('Cập nhật trạng thái thất bại: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header & Stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Sơ Đồ Bàn Trực Quan</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý sơ đồ bàn, tình trạng phục vụ và mở đơn gọi món tại bàn
          </p>
        </div>

        {/* Legend / Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Trống: <strong>{availableCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Có khách: <strong>{occupiedCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Đã đặt: <strong>{reservedCount}</strong>
          </div>
          <button
            onClick={loadTables}
            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Làm mới sơ đồ"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedZone === zone
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {zone === 'ALL' ? 'Tất Cả Khu Vực' : zone}
          </button>
        ))}
      </div>

      {/* Main layout: Table Grid & Detail Sidepanel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Grid (2 cols) */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Đang tải sơ đồ bàn...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTables.map((table) => {
                const isSelected = selectedTable?.id === table.id;
                let statusBg = 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:border-emerald-500';
                let badge = <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Trống</span>;

                if (table.status === 'OCCUPIED') {
                  statusBg = 'bg-rose-50 border-rose-300 text-rose-900 hover:border-rose-500';
                  badge = <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse">Có Khách</span>;
                } else if (table.status === 'RESERVED') {
                  statusBg = 'bg-amber-50 border-amber-300 text-amber-900 hover:border-amber-500';
                  badge = <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Đã Đặt</span>;
                }

                return (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between text-left h-36 ${statusBg} ${
                      isSelected ? 'ring-3 ring-blue-500 shadow-lg scale-102' : 'shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base">{table.tableNumber}</span>
                        {badge}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {table.capacity} chỗ ngồi
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 truncate">{table.zone}</span>
                      {table.status === 'OCCUPIED' && (
                        <span className="font-bold text-rose-600">Đang phục vụ</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Table Detail Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 h-fit">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            Chi Tiết Bàn Ăn
          </h3>

          {selectedTable ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">{selectedTable.tableNumber}</h4>
                  <p className="text-slate-500">{selectedTable.zone} • {selectedTable.capacity} người</p>
                </div>
                <div>
                  {selectedTable.status === 'AVAILABLE' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">Trống</span>
                  )}
                  {selectedTable.status === 'OCCUPIED' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">Có khách</span>
                  )}
                  {selectedTable.status === 'RESERVED' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">Đã đặt trước</span>
                  )}
                </div>
              </div>

              {/* Status switcher */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 block">Đổi trạng thái nhanh:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedTable.id, 'AVAILABLE')}
                    className="py-1 px-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[10px] font-bold hover:bg-emerald-50"
                  >
                    Bàn Trống
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTable.id, 'OCCUPIED')}
                    className="py-1 px-2 rounded-lg bg-white border border-rose-300 text-rose-800 text-[10px] font-bold hover:bg-rose-50"
                  >
                    Có Khách
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTable.id, 'RESERVED')}
                    className="py-1 px-2 rounded-lg bg-white border border-amber-300 text-amber-800 text-[10px] font-bold hover:bg-amber-50"
                  >
                    Đã Đặt
                  </button>
                </div>
              </div>

              {/* Active Order info if occupied */}
              {selectedTable.status === 'OCCUPIED' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h5 className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Đơn Hàng Hiện Tại</span>
                    {activeOrder && (
                      <span className="font-mono text-amber-600 font-semibold">{activeOrder.orderNumber}</span>
                    )}
                  </h5>

                  {loadingOrder ? (
                    <p className="text-slate-400">Đang tải đơn hàng...</p>
                  ) : activeOrder ? (
                    <div className="space-y-2">
                      <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
                        {activeOrder.items?.map((item) => (
                          <div key={item.id} className="p-2 flex items-center justify-between text-[11px]">
                            <span>{item.menuItemName} <strong className="text-blue-600">x{item.quantity}</strong></span>
                            <span className="font-semibold">{Number(item.subtotal).toLocaleString('vi-VN')} đ</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold pt-1">
                        <span>Tổng tiền:</span>
                        <span className="text-amber-600 text-sm">
                          {Number(activeOrder.finalAmount).toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleOpenNewOrder(selectedTable)}
                          className="py-2 px-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm Món
                        </button>
                        <button
                          onClick={() => handleGoToCheckout(selectedTable, activeOrder.id)}
                          className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Thanh Toán
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3 text-slate-400">
                      <p>Chưa có món ăn trong đơn</p>
                      <button
                        onClick={() => handleOpenNewOrder(selectedTable)}
                        className="mt-2 py-1.5 px-3 bg-blue-600 text-white rounded-lg font-bold text-xs"
                      >
                        Tạo Đơn Gọi Món
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Action if available */}
              {selectedTable.status === 'AVAILABLE' && (
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenNewOrder(selectedTable)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Utensils className="w-4 h-4" />
                    Mở Bàn & Gọi Món (POS)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Grid className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Chọn một bàn trên sơ đồ để xem thông tin chi tiết hoặc mở đơn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
