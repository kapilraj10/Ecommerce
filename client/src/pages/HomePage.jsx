import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/endpoints';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiRefreshCw } from 'react-icons/fi';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts({ limit: 8, sort: 'newest' }),
          categoryService.getCategories(),
        ]);
        setFeaturedProducts(productsRes.data.data.products);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Shop the Best Products in Nepal
            </h1>
            <p className="text-primary-100 text-lg mb-8">
              Discover amazing deals on thousands of products. Fast delivery across Nepal.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Shop Now <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FiTruck, label: 'Free Shipping', desc: 'On orders over Rs. 1000' },
            { icon: FiShield, label: 'Secure Payment', desc: '100% secure checkout' },
            { icon: FiHeadphones, label: '24/7 Support', desc: 'Dedicated support team' },
            { icon: FiRefreshCw, label: 'Easy Returns', desc: '7-day return policy' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
              <Icon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-sm">{label}</h3>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Categories</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              View All <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary-600 font-bold text-lg">{cat.name[0]}</span>
                </div>
                <h3 className="font-medium text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            View All <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
