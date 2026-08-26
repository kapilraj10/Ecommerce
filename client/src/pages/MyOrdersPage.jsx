import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/endpoints';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { FiPackage, FiEye } from 'react-icons/fi';

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-100 p-5">
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
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <span className="text-xs text-gray-500">{order.paymentMethod}</span>
                  <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
                </div>
                <Link to={`/orders/${order._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                  <FiEye className="h-4 w-4" /> View Details
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
