import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, shippingCost, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FiShoppingBag className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Start shopping to add items to your cart.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div key={item.product} className="bg-white rounded-2xl border border-gray-100/80 p-4 flex gap-4 hover:shadow-card transition-shadow duration-200">
              <Link to={`/products/${item.product}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-bold">{item.name[0]}</div>
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link to={`/products/${item.product}`} className="font-medium text-slate-800 hover:text-primary-600 line-clamp-1 text-sm transition-colors">
                  {item.name}
                </Link>
                <p className="text-primary-600 font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-2 hover:bg-gray-50 transition-colors">
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold min-w-[32px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={item.quantity >= item.stock}>
                      <FiPlus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.product)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all" aria-label="Remove item">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 sticky top-24">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{shippingCost === 0 ? <span className="text-green-600">Free</span> : formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-primary-600 text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            {shippingCost > 0 && (
              <p className="text-xs text-gray-500 mt-2">Free shipping on orders over Rs. 1,000</p>
            )}
            <Link
              to={isAuthenticated ? '/checkout' : '/login'}
              className="btn-primary w-full mt-6 block text-center py-3"
            >
              Proceed to Checkout
            </Link>
            <Link to="/products" className="flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-3 font-medium">
              <FiArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
