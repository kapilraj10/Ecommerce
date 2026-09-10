import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/endpoints';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { SkeletonProductDetail } from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import ImageZoom from '../components/ImageZoom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft, FiHeart,
  FiTruck, FiShield, FiZap, FiCheck, FiChevronRight, FiTag, FiBox,
} from 'react-icons/fi';

const TABS = ['Overview', 'Specifications', 'Reviews', 'Shipping & Returns'];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCart();
  const [reviewHighlight, setReviewHighlight] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated } = useAuth();
  const wishlisted = isWishlisted(id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, relatedRes, reviewRes] = await Promise.all([
          productService.getProduct(id),
          productService.getRelatedProducts(id),
          api.get(`/reviews/product/${id}`),
        ]);
        setProduct(prodRes.data.data);
        setRelated(relatedRes.data.data);
        setReviews(reviewRes.data.data.reviews || []);
        setSelectedImage(0);
        setActiveTab('Overview');

        if (isAuthenticated) {
          try {
            const myReviewRes = await api.get(`/reviews/my-review/${id}`);
            if (myReviewRes.data.data) {
              setMyReview(myReviewRes.data.data);
              setReviewForm({
                rating: myReviewRes.data.data.rating,
                title: myReviewRes.data.data.title || '',
                comment: myReviewRes.data.data.comment,
              });
            }
          } catch {
            setMyReview(null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    setAddingToCart(true);
    addToCart(product, quantity);
    setTimeout(() => setAddingToCart(false), 800);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return toast.error('Out of stock');
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return toast.error('Please write a review');
    setSubmittingReview(true);
    try {
      if (myReview) {
        await api.put(`/reviews/${myReview._id}`, reviewForm);
        toast.success('Review updated');
      } else {
        await api.post('/reviews', { ...reviewForm, product: id });
        toast.success('Review submitted');
      }
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.data.reviews || []);
      const myRes = await api.get(`/reviews/my-review/${id}`);
      setMyReview(myRes.data.data);
      setShowReviewForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    try {
      await api.delete(`/reviews/${myReview._id}`);
      toast.success('Review deleted');
      setMyReview(null);
      setReviewForm({ rating: 5, title: '', comment: '' });
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.data.reviews || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const scrollToReviews = () => {
    setActiveTab('Reviews');
    setTimeout(() => {
      const el = document.getElementById('reviews');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setReviewHighlight(true);
        setTimeout(() => setReviewHighlight(false), 1600);
      }
    }, 100);
  };

  if (loading) return <SkeletonProductDetail />;
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FiBox className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">Unable to load this product. It may have been removed.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft className="h-4 w-4" /> Browse Products
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const savings = product.discountPrice > 0 ? product.price - product.discountPrice : 0;
  const averageRating = product.rating || 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <FiChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        {product.category && (
          <>
            <FiChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <Link to={`/products?category=${product.category._id}`} className="hover:text-primary-600 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <FiChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Gallery + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left - Gallery */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden aspect-square">
            {product.images?.[selectedImage] ? (
              <ImageZoom src={product.images[selectedImage]} alt={product.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl font-bold">
                {product.name?.[0]}
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    selectedImage === i
                      ? 'border-primary-500 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Info */}
        <div className="flex flex-col">
          {product.category && (
            <Link
              to={`/products?category=${product.category._id}`}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors mb-2"
            >
              {product.category.name}
            </Link>
          )}

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <button
              onClick={() => toggleWishlist(id)}
              className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
                wishlisted
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700">{averageRating.toFixed(1)}</span>
            {reviews.length > 0 && (
              <button
                onClick={scrollToReviews}
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors underline-offset-2 hover:underline"
              >
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </button>
            )}
          </div>

          {/* Price */}
          <div className="mt-5 p-4 bg-gray-50/80 rounded-xl border border-gray-100/80">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {formatPrice(effectivePrice)}
              </span>
              {product.discountPrice > 0 && (
                <>
                  <span className="text-base text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                    SAVE {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.brand && (
            <p className="text-sm text-gray-600 mt-2">
              Brand: <span className="font-medium text-slate-800">{product.brand}</span>
            </p>
          )}

          {/* Quantity + Actions */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="px-4 font-semibold text-sm min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              {addingToCart ? (
                <>
                  <FiCheck className="h-5 w-5" /> Added to Cart
                </>
              ) : (
                <>
                  <FiShoppingCart className="h-5 w-5" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <FiZap className="h-5 w-5" /> Buy Now
            </button>

            <button
              onClick={() => toggleWishlist(id)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <FiHeart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-gray-50/80 rounded-xl px-3.5 py-3 border border-gray-100/80">
              <FiTruck className="h-5 w-5 text-primary-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Fast Delivery</p>
                <p className="text-[11px] text-gray-500">On orders over Rs. 1000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/80 rounded-xl px-3.5 py-3 border border-gray-100/80">
              <FiShield className="h-5 w-5 text-primary-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Secure Payment</p>
                <p className="text-[11px] text-gray-500">100% protected checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 md:mt-16 border-t border-gray-100 pt-8">
        <div className="flex gap-0 border-b border-gray-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-slate-800 hover:border-gray-300'
              }`}
            >
              {tab}
              {tab === 'Reviews' && reviews.length > 0 && (
                <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                  {reviews.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="py-6">
          {/* Overview Tab */}
          {activeTab === 'Overview' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Product Description</h3>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line max-w-3xl">
                {product.description || 'No description available for this product.'}
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'Specifications' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
              <div className="max-w-2xl">
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.brand && (
                        <tr className="border-b border-gray-50">
                          <td className="px-4 py-3 font-medium text-slate-700 bg-gray-50/50 w-1/3">Brand</td>
                          <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                        </tr>
                      )}
                      <tr className="border-b border-gray-50">
                        <td className="px-4 py-3 font-medium text-slate-700 bg-gray-50/50 w-1/3">Category</td>
                        <td className="px-4 py-3 text-gray-600">{product.category?.name || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="px-4 py-3 font-medium text-slate-700 bg-gray-50/50 w-1/3">Price</td>
                        <td className="px-4 py-3 text-gray-600">{formatPrice(product.price)}</td>
                      </tr>
                      {product.discountPrice > 0 && (
                        <tr className="border-b border-gray-50">
                          <td className="px-4 py-3 font-medium text-slate-700 bg-gray-50/50 w-1/3">Sale Price</td>
                          <td className="px-4 py-3 text-green-600 font-medium">{formatPrice(product.discountPrice)}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-4 py-3 font-medium text-slate-700 bg-gray-50/50 w-1/3">Availability</td>
                        <td className="px-4 py-3 text-gray-600">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'Reviews' && (
            <div
              id="reviews"
              className={`animate-fade-in rounded-2xl ${reviewHighlight ? 'animate-highlight' : ''}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn-secondary text-sm"
                  >
                    {showReviewForm ? 'Cancel' : myReview ? 'Edit Your Review' : 'Write a Review'}
                  </button>
                )}
              </div>

              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-gray-50/80 rounded-xl border border-gray-100/80">
                  <div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-gray-200">
                    <div className="text-4xl font-bold text-slate-900">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center gap-0.5 justify-center sm:justify-start mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingCounts.map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-gray-600">{star} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-gray-500 text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl border border-gray-100/80 p-5 mb-6 max-w-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                          <FiStar className={`h-6 w-6 transition-colors ${s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="input-field"
                      placeholder="Review title (optional)"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Review *</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={3}
                      className="input-field"
                      placeholder="Write your review..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
                      {submittingReview ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    {myReview && (
                      <button type="button" onClick={handleDeleteReview} className="btn-danger text-sm">
                        Delete Review
                      </button>
                    )}
                  </div>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-gray-50/60 rounded-xl border border-gray-100/80">
                  <FiStar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-white rounded-2xl border border-gray-100/80 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <span className="font-medium text-sm text-slate-800">{r.user?.name}</span>
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Verified</span>
                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.title && <p className="font-semibold text-sm text-slate-800 mb-1">{r.title}</p>}
                      <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shipping & Returns Tab */}
          {activeTab === 'Shipping & Returns' && (
            <div className="animate-fade-in max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Shipping Information</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Free shipping on orders over Rs. 1,000
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Standard delivery within 2-5 business days
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Express delivery available in Kathmandu Valley
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Return Policy</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    7-day return policy for unused items
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Full refund for defective products
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Easy return process with customer support
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-12 md:mt-16 border-t border-gray-100 pt-8">
          <h2 className="section-heading mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
