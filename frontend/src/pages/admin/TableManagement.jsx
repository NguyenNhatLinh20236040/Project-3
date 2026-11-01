import React, { useState, useEffect } from 'react';
import { tableApi } from '../../api/tableApi';
import { 
  Grid, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Users, 
  MapPin, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    zone: 'Tầng 1 - Sân Vườn',
    status: 'AVAILABLE',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await tableApi.getTables();
      setTables(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({
      tableNumber: `Bàn ${tables.length + 1 < 10 ? '0' + (tables.length + 1) : tables.length + 1}`,
      capacity: 4,
      zone: 'Tầng 1 - Sân Vườn',
      status: 'AVAILABLE',
      notes: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      zone: table.zone,
      status: table.status,
      notes: table.notes || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bàn ăn này?')) return;
    try {
      await tableApi.deleteTable(id);
      loadTables();
    } catch (err) {
      alert('Xóa bàn thất bại: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        tableNumber: formData.tableNumber,
        capacity: Number(formData.capacity),
        zone: formData.zone,
        status: formData.status,
        notes: formData.notes,
      };

      if (editingTable) {
        await tableApi.updateTable(editingTable.id, payload);
      } else {
        await tableApi.createTable(payload);
      }

      setIsModalOpen(false);
      loadTables();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu thông tin bàn');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Grid className="w-6 h-6 text-purple-600" />
            Quản Lý Danh Sách Bàn Ăn
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình số bàn, sức chứa và phân chia theo khu vực nhà hàng
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Thêm Bàn Mới
        </button>
      </div>

      {/* Table grid / list */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Số bàn</th>
                <th className="p-4">Khu vực</th>
                <th className="p-4">Sức chứa</th>
                <th className="p-4">Trạng thái hiện tại</th>
                <th className="p-4">Ghi chú</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Đang tải danh sách bàn...</td>
                </tr>
              ) : tables.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Chưa có bàn nào trong hệ thống</td>
                </tr>
              ) : (
                tables.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-slate-900 text-sm">
                      {t.tableNumber}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold">
                        {t.zone}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {t.capacity} người
                    </td>
                    <td className="p-4">
                      {t.status === 'AVAILABLE' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Trống
                        </span>
                      )}
                      {t.status === 'OCCUPIED' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Có khách
                        </span>
                      )}
                      {t.status === 'RESERVED' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Đã đặt
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 italic">
                      {t.notes || '--'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa bàn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-purple-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingTable ? 'Chỉnh Sửa Thông Tin Bàn' : 'Thêm Bàn Ăn Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-purple-200 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số / Tên bàn *</label>
                <input
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="Ví dụ: Bàn 09 hoặc VIP 05"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sức chứa (Người) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trạng thái *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="AVAILABLE">Trống</option>
                    <option value="OCCUPIED">Có khách</option>
                    <option value="RESERVED">Đã đặt trước</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khu vực *</label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                >
                  <option value="Tầng 1 - Sân Vườn">Tầng 1 - Sân Vườn</option>
                  <option value="Tầng 2 - Máy Lạnh">Tầng 2 - Máy Lạnh</option>
                  <option value="Phòng VIP">Phòng VIP</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú vị trí</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Gần cửa sổ, view hồ cá..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-600/20"
                >
                  {editingTable ? 'Lưu Thay Đổi' : 'Thêm Bàn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
