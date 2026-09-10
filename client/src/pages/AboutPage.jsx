import { FiTarget, FiHeart, FiUsers, FiShield } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About TEKORA</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Your trusted partner for technology in Nepal. We make computing simple, accessible, and affordable.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white border border-gray-100/80 rounded-2xl p-6 md:p-8 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              TEKORA was founded with a simple mission: to make technology accessible to everyone in Nepal.
              We started as a small store in Kathmandu and have grown into one of the most trusted names
              in computing and technology retail.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Today, we offer a wide range of computers, laptops, printers, components, and accessories from
              leading brands — all backed by genuine warranty and expert support. Whether you&apos;re building
              your first PC or upgrading your office setup, we&apos;re here to help.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FiTarget, title: 'Our Mission', desc: 'To simplify technology and make it accessible to every Nepali.' },
            { icon: FiHeart, title: 'Our Values', desc: 'Honesty, quality, and customer-first approach in everything we do.' },
            { icon: FiUsers, title: 'Our Team', desc: 'Passionate tech enthusiasts ready to help you find the right product.' },
            { icon: FiShield, title: 'Our Promise', desc: 'Genuine products, transparent pricing, and reliable after-sales support.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center bg-white border border-gray-100/80 rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
