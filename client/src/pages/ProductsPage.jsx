import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../services/endpoints';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SkeletonCard } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 12 };
        if (currentSearch) params.search = currentSearch;
        if (currentCategory) {
          const match = categories.find(
            (c) => c.name?.toLowerCase() === currentCategory.toLowerCase()
          );
          params.category = match ? match._id : currentCategory;
        }
        if (currentSort) params.sort = currentSort;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await productService.getProducts(params);
        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentSearch, currentCategory, currentSort, currentPage, minPrice, maxPrice, categories]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {currentSearch ? `Results for "${currentSearch}"` : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} products found</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2 lg:hidden"
        >
          <FiFilter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:bg-transparent lg:relative lg:w-64' : 'hidden lg:block lg:w-64'} lg:block`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-elevated p-6 overflow-y-auto animate-slide-in' : ''} lg:relative lg:w-full bg-white rounded-2xl border border-gray-100/80 p-5 h-fit lg:sticky lg:top-24`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    !currentCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat._id)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      currentCategory === cat._id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
              Clear All Filters
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-gray-500">Sort:</span>
            {[
              { value: '', label: 'Latest' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'rating', label: 'Top Rated' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateParam('sort', value)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 font-medium ${
                  currentSort === value
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50/60 rounded-2xl border border-gray-100/80">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FiFilter className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-1">No products found</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', page);
                  setSearchParams(params);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
