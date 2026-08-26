import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <FiShoppingCart className="h-6 w-6" />
              E-Shop Nepal
            </div>
            <p className="text-sm text-gray-400">Your one-stop online shopping destination in Nepal. Quality products at affordable prices.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/products" className="block text-sm hover:text-white transition-colors">All Products</Link>
              <Link to="/products?sort=newest" className="block text-sm hover:text-white transition-colors">New Arrivals</Link>
              <Link to="/products?sort=price_asc" className="block text-sm hover:text-white transition-colors">Budget Friendly</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <div className="space-y-2">
              <Link to="/profile" className="block text-sm hover:text-white transition-colors">My Profile</Link>
              <Link to="/my-orders" className="block text-sm hover:text-white transition-colors">Order History</Link>
              <Link to="/cart" className="block text-sm hover:text-white transition-colors">Shopping Cart</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><FiMapPin className="h-4 w-4" /> Kathmandu, Nepal</div>
              <div className="flex items-center gap-2"><FiPhone className="h-4 w-4" /> +977-9800000000</div>
              <div className="flex items-center gap-2"><FiMail className="h-4 w-4" /> info@eshopnepal.com</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} E-Shop Nepal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;