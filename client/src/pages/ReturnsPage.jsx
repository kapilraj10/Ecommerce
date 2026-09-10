import { FiRotateCcw, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const ReturnsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Return & Refund Policy</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-center mb-12">
            We want you to be satisfied with your purchase. Here&apos;s our return policy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              { icon: FiClock, title: '7-Day Return Window', desc: 'Return products within 7 days of delivery.' },
              { icon: FiCheckCircle, title: 'Easy Process', desc: 'Contact us and we\'ll guide you through the return.' },
              { icon: FiRotateCcw, title: 'Full Refund', desc: 'Get a full refund once the returned item is inspected.' },
              { icon: FiXCircle, title: 'Non-Returnable Items', desc: 'Software, consumables and opened accessories may not be eligible.' },
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
            <h2 className="text-lg font-bold text-slate-900">Eligibility</h2>
            <p>To be eligible for a return, the item must be unused, in its original packaging, and in the same condition as you received it. You will need the receipt or proof of purchase.</p>

            <h2 className="text-lg font-bold text-slate-900">How to Initiate a Return</h2>
            <p>Contact our support team at +977-9869852053 or through the <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact Us</a> page with your order number and reason for return.</p>

            <h2 className="text-lg font-bold text-slate-900">Refund Processing</h2>
            <p>Once we receive and inspect the returned item, we will notify you of the refund status. Approved refunds will be processed within 5-7 business days to your original payment method.</p>

            <h2 className="text-lg font-bold text-slate-900">Exchanges</h2>
            <p>We only replace items if they are defective or damaged. If you need to exchange an item, contact us with your order details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
