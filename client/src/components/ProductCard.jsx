import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';
import { FiShoppingCart, FiStar, FiHeart, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product._id);

  const discount =
    product.discountPrice > 0
      ? Math.round((1 - product.discountPrice / product.price) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden hover:shadow-card-hover hover:border-gray-200/80 transition-all duration-300 group flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50/60">
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? 'bg-red-500 text-white shadow-md shadow-red-500/25 scale-110'
              : 'bg-white/90 text-gray-400 hover:text-red-500 shadow-sm backdrop-blur-sm opacity-80 group-hover:opacity-100'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart className={`h-4 w-4 transition-transform duration-200 ${wishlisted ? 'fill-current scale-110' : ''}`} />
        </button>

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] px-2.5 py-1 rounded-lg font-semibold z-10 shadow-sm">
            -{discount}%
          </span>
        )}

        <Link to={`/products/${product._id}`} className="block w-full h-full p-4">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl font-bold">
              {product.name?.[0]}
            </div>
          )}
        </Link>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-white/90 text-slate-800 font-semibold text-xs px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-medium text-[13px] text-slate-800 hover:text-primary-600 transition-colors duration-200 line-clamp-2 min-h-[36px] leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`h-3 w-3 ${
                i < Math.round(product.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-200'
              }`}
            />
          ))}
          <span className="text-[11px] text-gray-400 ml-0.5">
            ({product.numReviews || 0})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-base font-bold text-slate-900">
            {formatPrice(effectivePrice)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="w-full bg-slate-900 text-white hover:bg-primary-600 transition-all duration-200 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            aria-label={`Add ${product.name} to cart`}
          >
            {adding ? (
              <>
                <FiCheck className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <FiShoppingCart className="h-3.5 w-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
