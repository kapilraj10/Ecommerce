import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiTag, FiShoppingBag, FiUsers, FiArrowLeft, FiPercent } from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();

  const links = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/categories', icon: FiTag, label: 'Categories' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/coupons', icon: FiPercent, label: 'Coupons' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg text-primary-600">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors px-4 py-2">
            <FiArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64">
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {links.map(({ to, icon: Icon, label }) => {
              const isActive = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600">
              <FiArrowLeft className="h-3.5 w-3.5" /> Store
            </Link>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
