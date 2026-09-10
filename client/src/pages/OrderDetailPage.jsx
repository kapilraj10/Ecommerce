import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/endpoints';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderTimeline from '../components/OrderTimeline';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrder(id);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="text-center py-20"><p className="text-gray-500">Order not found</p></div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/my-orders" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-6 text-sm transition-colors">
          <FiArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100/80 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">Order Progress</h3>
          <OrderTimeline currentStatus={order.orderStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
              <p>{order.shippingAddress.province}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100/80 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Payment Info</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Method: <span className="font-medium text-gray-800">{order.paymentMethod}</span></p>
              <p>Status: <span className={`font-medium ${getStatusColor(order.paymentStatus).split(' ')[0]}`}>{order.paymentStatus}</span></p>
              {order.isPaid && order.paidAt && <p>Paid on: <span className="font-medium text-gray-800">{formatDate(order.paidAt)}</span></p>}
              {order.paymentInfo?.transactionId && <p>Transaction: <span className="font-medium text-gray-800">{order.paymentInfo.transactionId}</span></p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100/80 p-6 mt-6">
          <h3 className="font-semibold text-slate-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg font-bold"><FiPackage /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between font-semibold text-lg border-t border-gray-100 pt-2">
              <span className="text-slate-900">Total</span>
              <span className="text-primary-600">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;