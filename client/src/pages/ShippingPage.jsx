import { FiTruck, FiClock, FiMapPin, FiPackage } from 'react-icons/fi';

const ShippingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Shipping Policy</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-center mb-12">
            Everything you need to know about how we deliver your orders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              { icon: FiTruck, title: 'Kathmandu Valley', desc: '1-2 business days. Free delivery on orders above Rs. 5,000.' },
              { icon: FiClock, title: 'Outside Valley', desc: '3-5 business days depending on location and courier service.' },
              { icon: FiMapPin, title: 'Coverage Area', desc: 'We deliver across all major cities and towns in Nepal.' },
              { icon: FiPackage, title: 'Packaging', desc: 'All items are securely packed to prevent damage during transit.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white border border-gray-100/80 rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Order Processing</h2>
            <p>Orders placed before 2:00 PM are usually processed the same day. Orders placed after 2:00 PM or on holidays will be processed on the next business day.</p>

            <h2 className="text-lg font-bold text-slate-900">Shipping Charges</h2>
            <p>Standard shipping within Kathmandu valley is free for orders above Rs. 5,000. For orders below this amount, a flat fee of Rs. 100 applies. Shipping charges outside the valley vary by location.</p>

            <h2 className="text-lg font-bold text-slate-900">Tracking Your Order</h2>
            <p>Once your order is dispatched, you will receive a tracking link via email/SMS. You can also track your order from the My Orders section in your account.</p>

            <h2 className="text-lg font-bold text-slate-900">Contact Us</h2>
            <p>If you have any questions about shipping, feel free to <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">contact us</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
