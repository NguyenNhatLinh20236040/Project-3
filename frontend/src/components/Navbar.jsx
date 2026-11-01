import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Grid, 
  BookOpen, 
  Calendar, 
  Search,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  Golden Spoon
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-amber-600 font-semibold -mt-1">
                  Ẩm Thực & Quản Trị
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Trang Chủ
              </Link>
              <Link
                to="/menu"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/menu') ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Thực Đơn
              </Link>
              <Link
                to="/reservation"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/reservation') ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Đặt Bàn
              </Link>
              <Link
                to="/tracking"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/tracking') ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Tra Cứu
              </Link>

              {/* Staff / POS Links */}
              {isStaff && (
                <div className="h-4 w-px bg-slate-200 mx-1" />
              )}
              {isStaff && (
                <Link
                  to="/pos/tables"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/pos') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Sơ Đồ Bàn (POS)
                </Link>
              )}

              {/* Admin Links */}
              {isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      location.pathname.startsWith('/admin') ? 'text-purple-600 bg-purple-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Quản Trị
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {isMenuDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onClick={() => setIsMenuDropdownOpen(false)}
                    >
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600">
                        <LayoutDashboard className="w-4 h-4 text-purple-500" /> Dashboard Thống Kê
                      </Link>
                      <Link to="/admin/menu" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600">
                        <BookOpen className="w-4 h-4 text-purple-500" /> Quản Lý Thực Đơn
                      </Link>
                      <Link to="/admin/tables" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600">
                        <Grid className="w-4 h-4 text-purple-500" /> Quản Lý Bàn Ăn
                      </Link>
                      <Link to="/admin/reservations" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600">
                        <Calendar className="w-4 h-4 text-purple-500" /> Quản Lý Đặt Bàn
                      </Link>
                      <Link to="/admin/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600">
                        <Search className="w-4 h-4 text-purple-500" /> Lịch Sử Đơn Hàng
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Right side actions: Cart & User Auth */}
            <div className="flex items-center gap-2.5">
              {/* Cart Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                title="Giỏ món"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User Profile or Login */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</p>
                    <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {user.role === 'ROLE_ADMIN' ? '👑 Admin' : '👔 Nhân Viên'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Đăng Nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
