import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/endpoints';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import ImageZoom from '../components/ImageZoom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft, FiHeart } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated } = useAuth();
  const wishlisted = isWishlisted(id);

  useEffect(() => {
    const fetchData = async () => {
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

        if (isAuthenticated) {
          try {
            const myReviewRes = await api.get(`/reviews/my-review/${id}`);
            if (myReviewRes.data.data) {
              setMyReview(myReviewRes.data.data);
              setReviewForm({ rating: myReviewRes.data.data.rating, title: myReviewRes.data.data.title || '', comment: myReviewRes.data.data.comment });
            }
          } catch { /* no review yet */ }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated]);

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

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="text-center py-20"><p className="text-gray-500">Product not found</p></div>;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-6 text-sm">
        <FiArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden aspect-square">
            {product.images?.[selectedImage] ? (
              <ImageZoom src={product.images[selectedImage]} alt={product.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl font-bold">{product.name[0]}</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-primary-500' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && <Link to={`/products?category=${product.category._id}`} className="text-sm text-primary-600 hover:text-primary-700">{product.category.name}</Link>}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.name}</h1>
            <button onClick={() => toggleWishlist(id)} className={`p-2 rounded-full transition-colors ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'}`}>
              <FiHeart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (<FiStar key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />))}
            </div>
            <span className="text-sm text-gray-500">{product.numReviews} reviews</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold text-primary-600">{formatPrice(effectivePrice)}</span>
            {product.discountPrice > 0 && <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>

          <span className={`text-sm font-medium mt-2 inline-block ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>

          {product.brand && <p className="text-sm text-gray-600 mt-2">Brand: <span className="font-medium">{product.brand}</span></p>}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><FiMinus className="h-4 w-4" /></button>
              <span className="px-4 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-50" disabled={quantity >= product.stock}><FiPlus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => { addToCart(product, quantity); setQuantity(1); }} disabled={product.stock === 0} className="btn-primary flex items-center gap-2 flex-1 justify-center py-3">
              <FiShoppingCart className="h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
          {isAuthenticated && (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-secondary text-sm">
              {showReviewForm ? 'Cancel' : myReview ? 'Edit Your Review' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="card mb-6 max-w-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                    <FiStar className={`h-6 w-6 ${s <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} className="input-field" placeholder="Review title (optional)" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Review *</label>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} className="input-field" placeholder="Write your review..." />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
                {submittingReview ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
              </button>
              {myReview && (
                <button type="button" onClick={handleDeleteReview} className="btn-danger text-sm">Delete Review</button>
              )}
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {reviews.map((r) => (
              <div key={r._id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (<FiStar key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />))}
                  </div>
                  <span className="font-medium text-sm">{r.user?.name}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.title && <p className="font-medium text-sm">{r.title}</p>}
                <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (<ProductCard key={p._id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
