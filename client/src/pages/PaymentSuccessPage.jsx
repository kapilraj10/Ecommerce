import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentService } from '../services/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get('pidx');
      if (!pidx) {
        setLoading(false);
        return;
      }
      try {
        const res = await paymentService.verifyKhalti({ pidx });
        setVerified(res.data.data.paymentStatus === 'Paid' || res.data.data.isPaid);
        setOrderId(res.data.data._id);
        toast.success('Payment verified successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };
    verifyPayment();
  }, [searchParams]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md animate-fade-in">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${verified ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <FiCheckCircle className={`h-10 w-10 ${verified ? 'text-green-500' : 'text-yellow-500'}`} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{verified ? 'Payment Successful!' : 'Payment Processing'}</h1>
        <p className="text-gray-500 mb-8">
          {verified ? 'Your payment has been confirmed. Thank you for your purchase!' : 'Your payment is being processed. Please check back later.'}
        </p>
        <div className="flex gap-3 justify-center">
          {orderId && (
            <Link to={`/orders/${orderId}`} className="btn-primary flex items-center gap-2">
              View Order <FiArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link to="/my-orders" className="btn-secondary">My Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;