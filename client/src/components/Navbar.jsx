import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiGrid, FiHome, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <FiShoppingCart className="h-6 w-6" />
            E-Shop Nepal
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1">
              <FiHome className="h-4 w-4" /> Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1">
                <FiGrid className="h-4 w-4" /> Admin
              </Link>
            )}
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
              <FiShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiUser className="h-4 w-4" />
                  {user?.name?.split(' ')[0]}
                </Link>
                <Link to="/my-orders" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiPackage className="h-4 w-4" /> Orders
                </Link>
                <button onClick={logout} className="text-gray-600 hover:text-red-600 transition-colors">
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">Login</Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            {mobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
          </form>
          <div className="px-4 pb-4 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600">Products</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600">
              Cart ({itemCount})
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600">Admin Dashboard</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600">Profile</Link>
                <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600">My Orders</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-red-600">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-primary-600 font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;