import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiTool } from 'react-icons/fi';

const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    badge: 'PREMIUM TECH',
    title: 'Technology That Works For You',
    description: 'Discover powerful computers, laptops, printers, components and accessories at great prices.',
    primaryText: 'Shop Now',
    primaryUrl: '/products',
    secondaryText: 'Explore Deals',
    secondaryUrl: '/products',
  },
];

const TechComposition = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/60 via-primary-50/40 to-transparent rounded-full blur-3xl scale-110" />
    <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full max-w-[400px] h-auto drop-shadow-2xl opacity-90">
      <rect x="20" y="120" width="90" height="200" rx="8" fill="#1a1a2e" stroke="#2d2d44" strokeWidth="1.5" />
      <rect x="30" y="130" width="70" height="100" rx="4" fill="#111122" />
      <circle cx="65" cy="180" r="20" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
      <circle cx="65" cy="180" r="12" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" />
      <circle cx="65" cy="180" r="4" fill="#3b82f6" opacity="0.6" />
      <rect x="30" y="240" width="70" height="2" rx="1" fill="#3b82f6" opacity="0.3" />
      <rect x="30" y="248" width="70" height="2" rx="1" fill="#3b82f6" opacity="0.2" />
      <rect x="30" y="256" width="40" height="2" rx="1" fill="#3b82f6" opacity="0.15" />
      <rect x="30" y="280" width="14" height="6" rx="2" fill="#22c55e" opacity="0.7" />
      <rect x="48" y="280" width="14" height="6" rx="2" fill="#3b82f6" opacity="0.4" />
      <rect x="66" y="280" width="14" height="6" rx="2" fill="#666" opacity="0.3" />

      <g transform="translate(110, 140)">
        <rect x="0" y="0" width="140" height="90" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="6" y="6" width="128" height="74" rx="3" fill="#0f172a" />
        <rect x="10" y="10" width="120" height="66" rx="2" fill="#1e3a5f" />
        <rect x="20" y="22" width="100" height="40" rx="3" fill="url(#screenGrad)" opacity="0.9" />
        <text x="70" y="42" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" opacity="0.8">TEKORA</text>
        <text x="70" y="52" textAnchor="middle" fill="#93c5fd" fontSize="5" opacity="0.6">Computing Excellence</text>
        <rect x="-5" y="90" width="150" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
        <rect x="50" y="91" width="40" height="5" rx="1.5" fill="#334155" />
      </g>

      <g transform="translate(180, 30)">
        <rect x="0" y="0" width="180" height="110" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
        <rect x="5" y="5" width="170" height="95" rx="4" fill="#0c1222" />
        <rect x="10" y="10" width="160" height="85" rx="3" fill="url(#monitorGrad)" />
        <text x="90" y="45" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" opacity="0.7">TEKORA</text>
        <text x="90" y="58" textAnchor="middle" fill="#60a5fa" fontSize="6" opacity="0.5">Technology. Simplified.</text>
        <rect x="75" y="105" width="30" height="14" rx="1" fill="#1f2937" />
        <rect x="60" y="118" width="60" height="4" rx="2" fill="#1f2937" />
      </g>

      <g transform="translate(380, 80)">
        <path d="M30 60 C30 25, 50 5, 60 5 C70 5, 90 25, 90 60" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="20" y="50" width="20" height="32" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="23" y="54" width="14" height="24" rx="7" fill="#334155" />
        <circle cx="30" cy="66" r="3" fill="#3b82f6" opacity="0.5" />
        <rect x="80" y="50" width="20" height="32" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="83" y="54" width="14" height="24" rx="7" fill="#334155" />
        <circle cx="90" cy="66" r="3" fill="#3b82f6" opacity="0.5" />
      </g>

      <g transform="translate(340, 190)">
        <rect x="0" y="0" width="55" height="100" rx="10" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
        <rect x="4" y="8" width="47" height="80" rx="6" fill="#0c1222" />
        <rect x="6" y="10" width="43" height="76" rx="5" fill="url(#phoneGrad)" />
        <text x="27.5" y="45" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" opacity="0.6">12:30</text>
        <rect x="18" y="3" width="18" height="3" rx="1.5" fill="#1f2937" />
        <circle cx="27.5" cy="96" r="2" fill="#334155" />
      </g>

      <g transform="translate(130, 280)">
        <ellipse cx="35" cy="25" rx="28" ry="25" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <ellipse cx="35" cy="25" rx="22" ry="20" fill="#0f172a" />
        <line x1="35" y1="5" x2="35" y2="25" stroke="#334155" strokeWidth="0.8" />
        <ellipse cx="35" cy="12" rx="6" ry="4" fill="#334155" />
        <circle cx="35" cy="30" r="3" fill="#3b82f6" opacity="0.4" />
        <rect x="10" y="40" width="50" height="2" rx="1" fill="#334155" opacity="0.3" />
      </g>

      <g transform="translate(260, 250)">
        <ellipse cx="18" cy="20" rx="12" ry="14" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <ellipse cx="18" cy="18" rx="6" ry="7" fill="#334155" />
        <circle cx="18" cy="17" r="2.5" fill="#3b82f6" opacity="0.4" />
        <rect x="14" y="32" width="8" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <ellipse cx="52" cy="20" rx="12" ry="14" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <ellipse cx="52" cy="18" rx="6" ry="7" fill="#334155" />
        <circle cx="52" cy="17" r="2.5" fill="#3b82f6" opacity="0.4" />
        <rect x="48" y="32" width="8" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
      </g>

      <circle cx="160" cy="100" r="3" fill="#3b82f6" opacity="0.2" />
      <circle cx="400" cy="170" r="2" fill="#3b82f6" opacity="0.15" />
      <circle cx="310" cy="300" r="2.5" fill="#60a5fa" opacity="0.2" />
      <rect x="90" y="90" width="6" height="6" rx="1" fill="#3b82f6" opacity="0.1" transform="rotate(45 93 93)" />

      <defs>
        <linearGradient id="screenGrad" x1="20" y1="22" x2="120" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0f2744" />
        </linearGradient>
        <linearGradient id="monitorGrad" x1="10" y1="10" x2="170" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f1d32" />
          <stop offset="1" stopColor="#0a1628" />
        </linearGradient>
        <linearGradient id="phoneGrad" x1="6" y1="10" x2="49" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1a3e" />
          <stop offset="1" stopColor="#0f1225" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const HeroBanner = ({ banners = [] }) => {
  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const count = displayBanners.length;

  const goTo = useCallback(
    (index) => {
      if (count === 0) return;
      setCurrent(((index % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [count, paused, next]);

  const banner = displayBanners[current] || displayBanners[0];

  return (
    <section
      className="bg-gradient-to-b from-gray-50/80 to-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[400px] lg:min-h-[480px] py-8 lg:py-0">
          <div className="flex flex-col justify-center py-8 lg:py-16 order-2 lg:order-1 animate-fade-in">
            {banner.badge && (
              <span className="inline-flex items-center self-start bg-primary-50 text-primary-700 text-[11px] font-semibold tracking-wider px-4 py-1.5 rounded-full mb-5 border border-primary-100 uppercase">
                {banner.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.08] text-slate-900 mb-4 text-balance">
              Technology That{' '}
              <span className="text-primary-600">Works</span>
              <br />For You
            </h1>
            <p className="text-gray-500 text-sm md:text-base lg:text-lg mb-7 max-w-md leading-relaxed">
              {banner.description || 'Discover powerful computers, laptops, printers, components and accessories at great prices.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-7 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-600">
                  <FiShield className="h-3 w-3" />
                </span>
                Genuine Products
              </span>
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 text-primary-600">
                  <FiTruck className="h-3 w-3" />
                </span>
                Fast Delivery
              </span>
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600">
                  <FiTool className="h-3 w-3" />
                </span>
                After-Sales Support
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={banner.primaryUrl || '/products'}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-[0.98]"
              >
                {banner.primaryText || 'Shop Now'} <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={banner.secondaryUrl || '/products'}
                className="inline-flex items-center gap-2 bg-white text-slate-700 border border-gray-200 hover:border-gray-300 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
              >
                {banner.secondaryText || 'Explore Deals'}
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-lg aspect-square relative">
              <TechComposition />
            </div>
          </div>
        </div>

        {count > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {displayBanners.map((b, i) => (
              <button
                key={b._id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-7 bg-primary-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
