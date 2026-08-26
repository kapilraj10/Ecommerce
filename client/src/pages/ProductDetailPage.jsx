import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/endpoints';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProduct(id);
        setProduct(res.data.data);
        setSelectedImage(0);

        const relatedRes = await productService.getRelatedProducts(id);
        setRelated(relatedRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl font-bold">
                {product.name[0]}
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-primary-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <Link to={`/products?category=${product.category._id}`} className="text-sm text-primary-600 hover:text-primary-700">
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.numReviews} reviews</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold text-primary-600">{formatPrice(effectivePrice)}</span>
            {product.discountPrice > 0 && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mt-4">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {product.brand && (
            <p className="text-sm text-gray-600 mt-2">Brand: <span className="font-medium">{product.brand}</span></p>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
                disabled={quantity >= product.stock}
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => { addToCart(product, quantity); setQuantity(1); }}
              disabled={product.stock === 0}
              className="btn-primary flex items-center gap-2 flex-1 justify-center py-3"
            >
              <FiShoppingCart className="h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
