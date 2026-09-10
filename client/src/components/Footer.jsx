import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiTruck, FiShield, FiCheckCircle, FiHeadphones } from 'react-icons/fi';

const Footer = () => {
  const features = [
    { icon: FiTruck, label: 'Fast Delivery' },
    { icon: FiShield, label: 'Secure Payment' },
    { icon: FiCheckCircle, label: 'Genuine Products' },
    { icon: FiHeadphones, label: '24/7 Support' },
  ];

  return (
    <footer className="relative overflow-hidden bg-white" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.08), transparent 35%), radial-gradient(circle at 80% 30%, rgba(96,165,250,0.06), transparent 30%)',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-12 pb-8">
        {/* Footer Links */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-6 pt-8"
          style={{ borderTop: '1px solid #E2E8F0' }}
        >
          {/* Brand */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-flex items-baseline gap-2 mb-4">
              <span className="text-[22px] font-extrabold tracking-tight leading-none" style={{ color: '#0F172A' }}>TEKORA</span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: '#94A3B8' }}>Technology. Simplified.</span>
            </Link>
            <p className="text-sm max-w-sm mb-6 leading-relaxed" style={{ color: '#64748B' }}>
              Computers, laptops, printers, components and accessories — all in one place. We provide
              genuine tech products with fast delivery across Nepal.
            </p>
            <div className="space-y-2.5 text-sm" style={{ color: '#475569' }}>
              <p className="flex items-center gap-2.5">
                <FiMapPin className="h-4 w-4 shrink-0" style={{ color: '#2563EB' }} /> Gyaneshwor, Kathmandu, Nepal
              </p>
              <p className="flex items-center gap-2.5">
                <FiPhone className="h-4 w-4 shrink-0" style={{ color: '#2563EB' }} /> +977-9869852053
              </p>
              <p className="flex items-center gap-2.5">
                <FiClock className="h-4 w-4 shrink-0" style={{ color: '#2563EB' }} /> Sun - Sat: 9:00 AM - 7:00 PM
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: '#0F172A' }}>Shop</h3>
            <div className="space-y-2.5">
              {['Computers', 'Laptops', 'Printers', 'Components', 'Accessories', 'Deals'].map((label) => (
                <Link
                  key={label}
                  to={label === 'Deals' ? '/products' : `/products?category=${label}`}
                  className="group block text-sm transition-colors duration-200"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: '#0F172A' }}>Support</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'Help Center', to: '/help' },
                { label: 'Shipping', to: '/shipping' },
                { label: 'Returns', to: '/returns' },
                { label: 'Track Order', to: '/track-order' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group block text-sm transition-colors duration-200"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: '#0F172A' }}>Company</h3>
            <div className="space-y-2.5">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Careers', to: '/careers' },
                { label: 'Blog', to: '/blog' },
                { label: 'FAQs', to: '/faqs' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group block text-sm transition-colors duration-200"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 text-xs" style={{ color: '#94A3B8' }}>
            {features.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid #E2E8F0', color: '#94A3B8' }}>
          <span>&copy; {new Date().getFullYear()} TEKORA. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/" className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>Privacy Policy</Link>
            <Link to="/" className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>Terms of Service</Link>
            <Link to="/" className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
