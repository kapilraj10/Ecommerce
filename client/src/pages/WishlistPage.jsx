import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiHeart } from 'react-icons/fi';

const WishlistPage = () => {
  const { items, loading } = useWishlist();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">My Wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/60 rounded-2xl border border-gray-100/80">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FiHeart className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Save products you love for later.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
