import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const PaymentFailedPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FiXCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8">Unfortunately, your payment could not be processed. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/cart" className="btn-primary">Try Again</Link>
          <Link to="/my-orders" className="btn-secondary">My Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
