import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/endpoints';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await adminService.getOrder(id);
        setOrder(res.data.data);
        setOrderStatus(res.data.data.orderStatus);
        setPaymentStatus(res.data.data.paymentStatus);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      const promises = [];
      if (orderStatus !== order.orderStatus) {
        promises.push(adminService.updateOrderStatus(id, { orderStatus }));
      }
      if (paymentStatus !== order.paymentStatus) {
        promises.push(adminService.updatePaymentStatus(id, { paymentStatus }));
      }
      await Promise.all(promises);
      toast.success('Order updated');
      const res = await adminService.getOrder(id);
      setOrder(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="text-center py-20"><p>Order not found</p></div>;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-4 text-sm">
        <FiArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold mb-3">Customer Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">{order.user?.name || order.shippingAddress.fullName}</p>
            <p>{order.user?.email || order.shippingAddress.email}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
            <p>{order.shippingAddress.province}</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Update Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="input-field">
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="input-field">
              {['Pending', 'Paid', 'Failed', 'Refunded'].map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <button onClick={updateStatus} disabled={saving} className="btn-primary flex items-center gap-2 justify-center">
            <FiSave className="h-4 w-4" /> {saving ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
              <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📦</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span></div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2"><span>Total</span><span className="text-primary-600">{formatPrice(order.totalPrice)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
