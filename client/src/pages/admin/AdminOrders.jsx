import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/endpoints';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import { FiEye, FiSearch } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminService.getAllOrders(params);
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-10" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="p-4 font-medium text-gray-500">Order ID</th>
                  <th className="p-4 font-medium text-gray-500">Customer</th>
                  <th className="p-4 font-medium text-gray-500">Items</th>
                  <th className="p-4 font-medium text-gray-500">Total</th>
                  <th className="p-4 font-medium text-gray-500">Payment</th>
                  <th className="p-4 font-medium text-gray-500">Status</th>
                  <th className="p-4 font-medium text-gray-500">Date</th>
                  <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || order.shippingAddress?.email || ''}</p>
                    </td>
                    <td className="p-4">{order.orderItems?.length || 0} items</td>
                    <td className="p-4 font-medium">{formatPrice(order.totalPrice)}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">{order.paymentMethod}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span></td>
                    <td className="p-4 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="p-4 text-right">
                      <Link to={`/admin/orders/${order._id}`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors inline-flex"><FiEye className="h-4 w-4" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchOrders} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
