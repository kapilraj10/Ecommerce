import { useState } from 'react';
import toast from 'react-hot-toast';
import { contactService } from '../services/endpoints';
import { FiMapPin, FiPhone, FiClock, FiMail, FiSend } from 'react-icons/fi';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return toast.error('Please fill in all required fields');
    setLoading(true);
    try {
      await contactService.submit(form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Have a question or need help? We&apos;re here for you. Reach out and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: FiMapPin, title: 'Visit Us', desc: 'Gyaneshwor, Kathmandu, Nepal' },
            { icon: FiPhone, title: 'Call Us', desc: '+977-9869852053' },
            { icon: FiClock, title: 'Working Hours', desc: 'Sun - Sat: 9:00 AM - 7:00 PM' },
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

        <div className="max-w-2xl mx-auto bg-white border border-gray-100/80 rounded-2xl p-6 md:p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600">
              <FiMail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Send us a message</h2>
              <p className="text-xs text-gray-500">We&apos;ll get back to you within 24 hours</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Your email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input-field"
            />
            <textarea
              rows={5}
              placeholder="Your message *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-field resize-none"
            />
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSend className="h-4 w-4" /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
