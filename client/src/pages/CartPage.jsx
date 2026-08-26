import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, shippingCost, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <Link to={`/products/${item.product}`} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-bold">{item.name[0]}</div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product}`} className="font-medium text-gray-800 hover:text-primary-600 line-clamp-1">{item.name}</Link>
                <p className="text-primary-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-2 hover:bg-gray-50"><FiMinus className="h-3 w-3" /></button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2 hover:bg-gray-50" disabled={item.quantity >= item.stock}><FiPlus className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.product)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : formatPrice(shippingCost)}</span></div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span><span className="text-primary-600">{formatPrice(total)}</span>
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
            <Link to="/products" className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
