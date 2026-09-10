import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiGrid,
  FiHome, FiSearch, FiHeart, FiChevronDown, FiMonitor, FiCpu, FiHardDrive,
  FiPrinter, FiHeadphones, FiZap,
} from 'react-icons/fi';

const NAV_LINKS = [
  { label: 'Computers', to: '/products?category=Computers' },
  { label: 'Laptops', to: '/products?category=Laptops' },
  { label: 'Printers', to: '/products?category=Printers' },
  { label: 'Components', to: '/products?category=Components' },
  { label: 'Accessories', to: '/products?category=Accessories' },
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-effect border-b border-gray-200/60 shadow-glass'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            <Link to="/" className="flex items-baseline gap-2 shrink-0">
              <span className="text-[24px] lg:text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">
                TEKORA
              </span>
              <span className="hidden sm:inline text-[10px] text-gray-400 tracking-[0.15em] uppercase font-medium leading-none">
                Technology. Simplified.
              </span>
            </Link>

            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className={`relative w-full transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search products, brands & categories..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-gray-50/80 text-sm text-slate-700 placeholder:text-gray-400 transition-all"
                  aria-label="Search products"
                />
              </div>
            </form>

            <div className="hidden lg:flex items-center gap-1">
              <Link
                to="/wishlist"
                className="relative p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                aria-label="Wishlist"
              >
                <FiHeart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-primary-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                aria-label="Cart"
              >
                <FiShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1 animate-fade-in">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-1.5" />
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                  >
                    <FiUser className="h-4 w-4" />
                    <span className="hidden xl:inline">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                      title="Admin Dashboard"
                      aria-label="Admin Dashboard"
                    >
                      <FiGrid className="h-5 w-5" />
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiUser className="h-4 w-4" /> {t('nav.login')}
                </Link>
              )}
            </div>

            <div className="flex lg:hidden items-center gap-1">
              <Link
                to="/cart"
                className="relative p-2 text-slate-600"
                aria-label="Cart"
              >
                <FiShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary-600 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-700"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-0.5 -mb-px pb-px">
            <Link
              to="/"
              className="px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-primary-600 rounded-t-lg transition-colors duration-200"
            >
              Home
            </Link>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-primary-600 rounded-t-lg transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/products"
              className="px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:text-red-600 rounded-t-lg transition-colors duration-200"
            >
              <FiZap className="inline h-3.5 w-3.5 mr-0.5 -mt-0.5" /> Deals
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-elevated overflow-y-auto animate-slide-in">
            <div className="p-5 space-y-1">
              <div className="flex items-center justify-between mb-5">
                <span className="text-lg font-bold text-slate-900">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-gray-100 rounded-xl transition-all"
                  aria-label="Close menu"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-5">
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-gray-50 text-sm"
                  />
                </div>
              </form>

              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <FiHome className="h-4 w-4" /> Home
              </Link>

              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  {l.label}
                </Link>
              ))}

              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 px-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <FiZap className="h-4 w-4" /> Deals
              </Link>

              <div className="border-t border-gray-100 my-3" />

              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3 px-3 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <span className="flex items-center gap-3">
                  <FiHeart className="h-4 w-4" /> Wishlist
                </span>
                {wishlistItems.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3 px-3 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <span className="flex items-center gap-3">
                  <FiShoppingCart className="h-4 w-4" /> Cart
                </span>
                {itemCount > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <FiGrid className="h-4 w-4" /> Admin Dashboard
                </Link>
              )}

              <div className="border-t border-gray-100 my-3" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <FiUser className="h-4 w-4" /> {t('nav.profile')}
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <FiPackage className="h-4 w-4" /> {t('nav.orders')}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 py-3 px-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all w-full text-left"
                  >
                    <FiLogOut className="h-4 w-4" /> {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all w-full text-center"
                >
                  <FiUser className="h-4 w-4" /> {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
