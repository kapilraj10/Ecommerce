import { FiCalendar, FiArrowRight } from 'react-icons/fi';

const POSTS = [
  { title: 'How to Choose the Right Laptop in 2026', excerpt: 'A complete guide to finding the perfect laptop for your needs and budget.', date: 'Sep 5, 2026', tag: 'Guides' },
  { title: 'Building a Budget PC: What You Need to Know', excerpt: 'Step-by-step tips for assembling a powerful PC without breaking the bank.', date: 'Aug 28, 2026', tag: 'DIY' },
  { title: 'Top 5 Printers for Home Office Use', excerpt: 'Compare the best printers for productivity, speed, and print quality.', date: 'Aug 15, 2026', tag: 'Reviews' },
];

const BlogPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Tips, guides, and insights from the world of technology.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {POSTS.map(({ title, excerpt, date, tag }) => (
            <article key={title} className="bg-white border border-gray-100/80 rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{tag}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><FiCalendar className="h-3.5 w-3.5" /> {date}</span>
              </div>
              <h2 className="font-semibold text-base text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">{title}</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                Read more <FiArrowRight className="h-3.5 w-3.5" />
              </span>
            </article>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-400">More articles coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
