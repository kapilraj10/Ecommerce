import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/endpoints';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SalesBarChart, OrderStatusPieChart } from '../../components/SalesChart';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try { const res = await adminService.getDashboard(); setStats(res.data.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <p>Failed to load dashboard</p>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-purple-500' },
    { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: FiDollarSign, color: 'bg-yellow-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: FiClock, color: 'bg-orange-500' },
    { label: 'Delivered Orders', value: stats.deliveredOrders, icon: FiCheckCircle, color: 'bg-emerald-500' },
  ];

  const monthlySales = stats.monthlySales || [];
  const orderStatusData = [
    { name: 'Pending', value: stats.pendingOrders || 0 },
    { name: 'Processing', value: stats.processingOrders || 0 },
    { name: 'Shipped', value: stats.shippedOrders || 0 },
    { name: 'Delivered', value: stats.deliveredOrders || 0 },
    { name: 'Cancelled', value: stats.cancelledOrders || 0 },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
              <div className={`${color} p-3 rounded-xl text-white`}><Icon className="h-5 w-5" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Sales Overview</h2>
          <SalesBarChart data={monthlySales} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Order Status Distribution</h2>
          <OrderStatusPieChart data={orderStatusData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="p-4 font-medium text-gray-500">Order ID</th>
                <th className="p-4 font-medium text-gray-500">Customer</th>
                <th className="p-4 font-medium text-gray-500">Amount</th>
                <th className="p-4 font-medium text-gray-500">Status</th>
                <th className="p-4 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">{order.user?.name || 'N/A'}</td>
                  <td className="p-4 font-medium">{formatPrice(order.totalPrice)}</td>
                  <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span></td>
                  <td className="p-4 text-gray-500">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
