import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/endpoints';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiMail, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';

const STATUS_OPTIONS = ['Unread', 'Read', 'Replied', 'Archived'];

const AdminContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [adminReply, setAdminReply] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await adminService.getContact(id);
        const c = res.data.data;
        setContact(c);
        setStatus(c.status);
        setAdminReply(c.adminReply || '');
      } catch (err) {
        toast.error('Failed to load message');
        navigate('/admin/contacts');
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateContact(id, { status, adminReply });
      toast.success('Updated successfully');
      navigate('/admin/contacts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!contact) return null;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/contacts" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-4 text-sm">
        <FiArrowLeft className="h-4 w-4" /> Back to Messages
      </Link>
      <h1 className="text-2xl font-bold mb-6">Message Details</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
            <FiUser className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">{contact.name}</h2>
            <p className="text-xs text-gray-500">{contact.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1"><FiClock className="h-3.5 w-3.5" /> {formatDate(contact.createdAt)}</span>
          {contact.subject && <span className="flex items-center gap-1"><FiMessageSquare className="h-3.5 w-3.5" /> {contact.subject}</span>}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {contact.message}
        </div>
      </div>

      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Reply / Notes</label>
          <textarea
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Write a reply or internal note..."
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          <FiSave className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminContactDetail;
