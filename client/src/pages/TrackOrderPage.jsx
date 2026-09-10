import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiSearch } from 'react-icons/fi';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 mx-auto mb-6">
            <FiPackage className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Track Your Order</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
            Enter your order ID to check the current status of your delivery.
          </p>

          <div className="bg-white border border-gray-100/80 rounded-2xl p-6 md:p-8 shadow-card">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input-field flex-1"
              />
              <Link
                to={orderId.trim() ? `/orders/${orderId.trim()}` : '#'}
                className="btn-primary flex items-center gap-2 shrink-0"
                onClick={(e) => { if (!orderId.trim()) e.preventDefault(); }}
              >
                <FiSearch className="h-4 w-4" /> Track
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              You can find your order ID in the confirmation email or in{' '}
              <a href="/my-orders" className="text-primary-600 hover:text-primary-700 font-medium">My Orders</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
