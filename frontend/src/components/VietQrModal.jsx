import React from 'react';
import { X, QrCode, CheckCircle, Smartphone } from 'lucide-react';

export default function VietQrModal({ isOpen, onClose, amount, orderNumber, onConfirmPayment }) {
  if (!isOpen) return null;

  const formattedAmount = Number(amount || 0).toLocaleString('vi-VN');
  const memo = `THANH TOAN ${orderNumber || 'DON HANG'}`;
  
  // Real dynamic VietQR image url from vietqr.io (or placeholder qr)
  const qrUrl = `https://api.vietqr.io/image/970422-0988888888-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=NHA%20HANG%20GOLDEN%20SPOON`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 text-center">
        {/* Header */}
        <div className="px-5 py-3.5 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <h3 className="font-bold text-sm">Chuyển Khoản Ngân Hàng (VietQR)</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner">
            <img
              src={qrUrl}
              alt="VietQR Payment"
              className="w-52 h-52 object-contain mx-auto rounded-lg"
              onError={(e) => {
                // Fallback to placeholder if offline
                e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(memo + ' - ' + amount);
              }}
            />
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-slate-500 font-medium">Số tiền cần thanh toán:</p>
            <p className="text-xl font-extrabold text-blue-600">{formattedAmount} đ</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200/60 rounded-xl text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Ngân hàng:</span>
              <span className="font-bold text-slate-800">MB Bank (Quân Đội)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số tài khoản:</span>
              <span className="font-mono font-bold text-slate-800">0988 888 888</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chủ tài khoản:</span>
              <span className="font-bold text-slate-800">NHÀ HÀNG GOLDEN SPOON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nội dung CK:</span>
              <span className="font-mono font-bold text-blue-700">{memo}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onConfirmPayment) onConfirmPayment();
              onClose();
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Xác Nhận Khách Đã Chuyển Khoản
          </button>
        </div>
      </div>
    </div>
  );
}
