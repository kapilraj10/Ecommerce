import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, paymentService } from '../services/endpoints';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cartItems, subtotal, shippingCost, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    province: '',
    district: '',
    city: '',
    address: '',
  });

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const required = ['fullName', 'phone', 'province', 'district', 'city', 'address'];
    for (const field of required) {
      if (!shipping[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} is required`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      if (paymentMethod === 'Khalti') {
        const res = await paymentService.initiateKhalti({
          orderItems: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
          shippingAddress: shipping,
        });
        clearCart();
        window.location.href = res.data.data.payment_url;
      } else {
        const res = await orderService.createOrder({
          orderItems: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
          shippingAddress: shipping,
          paymentMethod: 'COD',
        });
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex items-center justify-center mb-8">
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center gap-2 ${step > i + 1 ? 'text-green-600' : step === i + 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? 'bg-green-100 text-green-600' : step === i + 1 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? <FiCheck className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-200' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiTruck className="h-5 w-5" /> Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="fullName" value={shipping.fullName} onChange={handleShippingChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input name="phone" value={shipping.phone} onChange={handleShippingChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" value={shipping.email} onChange={handleShippingChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
              <input name="province" value={shipping.province} onChange={handleShippingChange} className="input-field" placeholder="e.g. Bagmati" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <input name="district" value={shipping.district} onChange={handleShippingChange} className="input-field" placeholder="e.g. Kathmandu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input name="city" value={shipping.city} onChange={handleShippingChange} className="input-field" placeholder="e.g. Kathmandu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input name="address" value={shipping.address} onChange={handleShippingChange} className="input-field" placeholder="Street address" />
            </div>
          </div>
          <button onClick={() => { if (validateShipping()) setStep(2); }} className="btn-primary mt-6">Continue to Payment</button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiCreditCard className="h-5 w-5" /> Payment Method</h2>
          <div className="space-y-3">
            {[{ id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive your order' }, { id: 'Khalti', label: 'Khalti', desc: 'Pay online using Khalti ePayment' }].map(({ id, label, desc }) => (
              <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="text-primary-600" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary">Review Order</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Review Order</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Shipping To</h3>
              <p className="text-sm">{shipping.fullName}, {shipping.phone}</p>
              <p className="text-sm text-gray-600">{shipping.address}, {shipping.city}, {shipping.district}, {shipping.province}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Payment</h3>
              <p className="text-sm">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Khalti Online Payment'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Items</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t"><span>Total</span><span className="text-primary-600">{formatPrice(total)}</span></div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
            <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? 'Processing...' : paymentMethod === 'Khalti' ? 'Pay with Khalti' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
