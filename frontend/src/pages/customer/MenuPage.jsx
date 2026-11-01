import React, { useState, useEffect } from 'react';
import { menuApi } from '../../api/menuApi';
import { useCart } from '../../context/CartContext';
import { 
  Search, 
  Plus, 
  Flame, 
  Leaf, 
  Clock, 
  Utensils, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedItemMap, setAddedItemMap] = useState({});

  const { addToCart, setIsDrawerOpen } = useCart();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadMenu();
  }, [selectedCategory, onlyVegetarian]);

  const loadCategories = async () => {
    try {
      const data = await menuApi.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadMenu = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (keyword.trim()) params.keyword = keyword.trim();
      if (onlyVegetarian) params.isVegetarian = true;

      const data = await menuApi.getMenuItems(params);
      setMenuItems(data || []);
    } catch (err) {
      console.error('Failed to load menu items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMenu();
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    setAddedItemMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Thực Đơn Nhà Hàng</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Khám phá hơn 50+ món ăn tuyển chọn từ các đầu bếp hàng đầu
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên món, nguyên liệu..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden w-64 shadow-2xs"
            />
          </form>

          <button
            type="button"
            onClick={() => setOnlyVegetarian(!onlyVegetarian)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              onlyVegetarian
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            Món Chay
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          🍽️ Tất Cả Món ({menuItems.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.name} ({cat.itemCount})
          </button>
        ))}
      </div>

      {/* Dish Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Đang tải thực đơn thơm ngon...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <Utensils className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-600">Không tìm thấy món ăn phù hợp</p>
          <p className="text-xs mt-1">Vui lòng thử tìm với từ khóa hoặc danh mục khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group text-left"
            >
              {/* Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  {item.isVegetarian && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                      <Leaf className="w-2.5 h-2.5" /> Chay
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                      <Flame className="w-2.5 h-2.5" /> Cay
                    </span>
                  )}
                </div>

                {/* Category tag */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium">
                  {item.categoryName}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description || 'Hương vị tuyệt hảo chế biến từ nguyên liệu hảo hạng.'}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Đơn giá</span>
                    <span className="text-sm font-extrabold text-amber-600">
                      {Number(item.price).toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      !item.isAvailable
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : addedItemMap[item.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    }`}
                  >
                    {!item.isAvailable ? (
                      'Tạm hết'
                    ) : addedItemMap[item.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Đã thêm
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Thêm món
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
