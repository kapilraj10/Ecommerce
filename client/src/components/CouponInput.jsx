import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiTag, FiX } from 'react-icons/fi';

const CouponInput = ({ subtotal, onApply, onRemove, appliedCoupon }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return toast.error('Enter a coupon code');
    setLoading(true);
    try {
      const res = await api.post('/coupons/validate', { code: code.trim(), subtotal });
      onApply(res.data.data);
      toast.success(`Coupon applied! Rs. ${res.data.data.discount} discount`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    onRemove();
    toast.success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
        <FiTag className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-700 flex-1">
          {appliedCoupon.code} — Rs. {appliedCoupon.discount} off
        </span>
        <button onClick={handleRemove} className="text-green-600 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg" aria-label="Remove coupon">
          <FiX className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Coupon code"
        className="input-field text-sm flex-1"
      />
      <button onClick={handleApply} disabled={loading} className="btn-secondary text-sm whitespace-nowrap">
        {loading ? '...' : 'Apply'}
      </button>
    </div>
  );
};

export default CouponInput;