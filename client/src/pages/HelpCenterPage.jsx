import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiMessageCircle, FiPackage, FiCreditCard, FiTruck } from 'react-icons/fi';

const FAQS = [
  { q: 'How do I place an order?', a: 'Browse our products, add items to your cart, and proceed to checkout. You can pay via Khalti, card, or choose cash on delivery.' },
  { q: 'What payment methods do you accept?', a: 'We accept Khalti, debit/credit cards, and cash on delivery (COD) within Kathmandu valley.' },
  { q: 'How long does delivery take?', a: 'Standard delivery within Kathmandu takes 1-2 business days. Outside the valley, it may take 3-5 business days.' },
  { q: 'Can I return a product?', a: 'Yes, you can return products within 7 days of delivery if they are unused and in original packaging. Contact us to initiate a return.' },
  { q: 'Do you offer warranty?', a: 'All products come with manufacturer warranty. Warranty period varies by product and brand.' },
  { q: 'How can I track my order?', a: 'Go to My Orders in your account to view real-time order status and tracking information.' },
];

const HelpCenterPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Help Center</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: FiPackage, title: 'Orders & Shipping', desc: 'Track, modify or cancel orders' },
            { icon: FiCreditCard, title: 'Payments & Refunds', desc: 'Payment options and refund status' },
            { icon: FiTruck, title: 'Delivery Info', desc: 'Delivery times and coverage areas' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 bg-white border border-gray-100/80 rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-800">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <FiSearch className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100/80 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-800">{faq.q}</span>
                  {openIdx === i ? <FiChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <FiChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>
                {openIdx === i && (
                  <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-3">Still need help?</p>
            <a href="/contact" className="btn-primary inline-flex items-center gap-2">
              <FiMessageCircle className="h-4 w-4" /> Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
