import { FiBriefcase, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';

const OPENINGS = [
  { title: 'Sales Executive', location: 'Gyaneshwor, Kathmandu', type: 'Full-time', desc: 'Help customers find the right tech products and deliver exceptional service.' },
  { title: 'Technical Support Specialist', location: 'Gyaneshwor, Kathmandu', type: 'Full-time', desc: 'Assist customers with product setup, troubleshooting, and after-sales support.' },
  { title: 'Social Media Manager', location: 'Remote / Kathmandu', type: 'Full-time', desc: 'Manage our social media presence and create engaging tech content.' },
];

const CareersPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Careers at TEKORA</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Join our team and help us make technology accessible to everyone in Nepal.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {OPENINGS.map(({ title, location, type, desc }) => (
            <div key={title} className="bg-white border border-gray-100/80 rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-base text-slate-800 mb-2">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{desc}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><FiMapPin className="h-3.5 w-3.5" /> {location}</span>
                    <span className="flex items-center gap-1"><FiClock className="h-3.5 w-3.5" /> {type}</span>
                  </div>
                </div>
                <a href="mailto:info@tekora.com" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 shrink-0 transition-colors">
                  Apply <FiArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t see a role that fits? Send your resume to{' '}
            <a href="mailto:info@tekora.com" className="text-primary-600 hover:text-primary-700 font-medium">info@tekora.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
