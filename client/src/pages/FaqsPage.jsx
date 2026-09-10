import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FAQS = [
  { q: 'What products does TEKORA sell?', a: 'We sell computers, laptops, printers, components, accessories, and networking equipment from leading brands.' },
  { q: 'Are all products genuine?', a: 'Yes, 100% of our products are genuine and come with official manufacturer warranty.' },
  { q: 'Do you offer installation services?', a: 'Yes, we offer free basic setup for laptops and computers purchased from our store. Custom PC builds include professional assembly.' },
  { q: 'Can I negotiate prices?', a: 'Our prices are competitive and transparent. For bulk orders, contact us directly for special pricing.' },
  { q: 'What brands do you carry?', a: 'We carry major brands including HP, Dell, Lenovo, ASUS, Acer, Intel, AMD, Corsair, and many more.' },
  { q: 'Do you offer EMI or installment options?', a: 'Currently we accept Khalti, card payments, and cash on delivery. EMI options may be available for select products — contact us for details.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via phone at +977-9869852053, WhatsApp, or through our Contact Us page.' },
  { q: 'Do you provide corporate/business solutions?', a: 'Yes, we provide bulk ordering and IT solutions for businesses. Contact us for a custom quote.' },
];

const FaqsPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Quick answers to common questions about TEKORA and our services.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-100/80 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-800 pr-4">{faq.q}</span>
                {openIdx === i ? <FiChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <FiChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
              </button>
              {openIdx === i && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-500">
            Still have questions?{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqsPage;
