import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService, heroBannerService } from '../services/endpoints';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { SkeletonCard } from '../components/Skeleton';
import {
  FiArrowRight, FiMapPin, FiPhone, FiClock, FiCpu, FiMonitor,
  FiHardDrive, FiPrinter, FiHeadphones, FiSpeaker,
} from 'react-icons/fi';

const STORE = {
  name: 'TEKORA',
  phone: '+977-9869852053',
  whatsapp: '9869852053',
  address: 'Gyaneshwor, Kathmandu, Nepal',
  hours: 'Sun - Sat: 9:00 AM - 7:00 PM',
};

const CATEGORY_ICONS = {
  Components: FiCpu,
  Computers: FiMonitor,
  Laptops: FiHardDrive,
  Printers: FiPrinter,
  Accessories: FiHeadphones,
  Networking: FiMonitor,
  Gaming: FiSpeaker,
};

const CATEGORY_COLORS = [
  'from-blue-500/10 to-blue-600/5 border-blue-200/60 hover:border-blue-300',
  'from-violet-500/10 to-violet-600/5 border-violet-200/60 hover:border-violet-300',
  'from-emerald-500/10 to-emerald-600/5 border-emerald-200/60 hover:border-emerald-300',
  'from-amber-500/10 to-amber-600/5 border-amber-200/60 hover:border-amber-300',
  'from-rose-500/10 to-rose-600/5 border-rose-200/60 hover:border-rose-300',
];

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [deals, setDeals] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsRes, popularRes, categoriesRes, bannerRes] = await Promise.all([
          productService.getProducts({ limit: 8, sort: 'newest' }).catch(() => ({ data: { data: { products: [] } } })),
          productService.getProducts({ limit: 8, sort: 'rating' }).catch(() => ({ data: { data: { products: [] } } })),
          categoryService.getCategories().catch(() => ({ data: { data: [] } })),
          heroBannerService.getActive().catch(() => ({ data: { data: [] } })),
        ]);
        setDeals((dealsRes.data.data.products || []).filter((p) => p.discountPrice > 0));
        setPopular(popularRes.data.data.products || []);
        setCategories(categoriesRes.data.data || []);
        setBanners(bannerRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const displayCategories = categories.slice(0, 8);

  return (
    <div className="bg-white min-h-screen">
      <HeroBanner banners={banners} />

      {displayCategories.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-heading">Shop by Category</h2>
              <p className="section-subheading">Browse our wide selection of tech products</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              View All <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {displayCategories.map((cat, idx) => {
              const Icon = CATEGORY_ICONS[cat.name] || FiMonitor;
              const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              return (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  className={`group flex flex-col items-center gap-3 bg-gradient-to-br ${colorClass} border rounded-2xl px-4 py-6 transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 shadow-sm text-slate-700 group-hover:text-primary-600 transition-colors duration-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {cat.productCount || 0} products
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {deals.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-heading">Today's Deals</h2>
              <p className="section-subheading">Save big on these limited-time offers</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              View All <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {deals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-50/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-heading">Popular Products</h2>
              <p className="section-subheading">Top-rated products loved by our customers</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              View All <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {popular.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {popular.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">Products coming soon.</p>
          )}
        </div>
      </section>

      <section className="border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Visit Our Store</h2>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed max-w-md">
                Come to our store, check the products in person and get expert advice on your next build.
              </p>
              <ul className="space-y-4 mb-7">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 shrink-0">
                    <FiMapPin className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="mt-1">{STORE.address}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 shrink-0">
                    <FiPhone className="h-4 w-4 text-primary-600" />
                  </div>
                  <a href={`tel:${STORE.phone}`} className="mt-1 hover:text-primary-600 transition-colors">{STORE.phone}</a>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 shrink-0">
                    <FiClock className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="mt-1">{STORE.hours}</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://maps.app.goo.gl/FvGNAuh1MfmeAchc8"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <FiMapPin className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href={`tel:${STORE.phone}`}
                  className="inline-flex items-center gap-2 border border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  <FiPhone className="h-4 w-4" /> Contact Us
                </a>
              </div>
            </div>
            <div className="h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-200/60">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2!2d85.332244!3d27.7084556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19001ab67833%3A0xd248d7f831052847!2sA.R.D.%20Suppliers%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TEKORA Store Location"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
