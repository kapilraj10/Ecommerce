import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const PaymentFailedPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <FiXCircle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8">Unfortunately, your payment could not be processed. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/cart" className="btn-primary">Try Again</Link>
          <Link to="/my-orders" className="btn-secondary">My Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;