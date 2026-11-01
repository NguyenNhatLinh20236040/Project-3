import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Customer Pages
import CustomerHome from './pages/customer/CustomerHome';
import MenuPage from './pages/customer/MenuPage';
import ReservationPage from './pages/customer/ReservationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';

// POS Pages
import TableMapPage from './pages/pos/TableMapPage';
import OrderPosPage from './pages/pos/OrderPosPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MenuManagement from './pages/admin/MenuManagement';
import TableManagement from './pages/admin/TableManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import OrderHistory from './pages/admin/OrderHistory';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerHome />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/tracking" element={<OrderTrackingPage />} />

                {/* Staff / POS Routes */}
                <Route path="/pos/tables" element={<TableMapPage />} />
                <Route path="/pos/order" element={<OrderPosPage />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/menu" element={<MenuManagement />} />
                <Route path="/admin/tables" element={<TableManagement />} />
                <Route path="/admin/reservations" element={<ReservationManagement />} />
                <Route path="/admin/orders" element={<OrderHistory />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <CartDrawer />
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
