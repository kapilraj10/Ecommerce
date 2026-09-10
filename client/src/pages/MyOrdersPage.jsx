import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/endpoints';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { SkeletonCard } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { FiPackage, FiEye, FiChevronRight } from 'react-icons/fi';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders({ page, limit: 10 });
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/60 rounded-2xl border border-gray-100/80">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FiPackage className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-card transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {order.orderItems.slice(0, 2).map((item, i) => (
                  <p key={i} className="text-sm text-gray-600">{item.name} x {item.quantity}</p>
                ))}
                {order.orderItems.length > 2 && <p className="text-xs text-gray-400">+{order.orderItems.length - 2} more items</p>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">{order.paymentMethod}</span>
                  <p className="font-semibold text-slate-900">{formatPrice(order.totalPrice)}</p>
                </div>
                <Link to={`/orders/${order._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors">
                  View Details <FiChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchOrders} />
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;