import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/endpoints';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { FiEye, FiTrash2, FiSearch, FiMail, FiInbox, FiFilter } from 'react-icons/fi';

const STATUS_COLORS = {
  Unread: 'bg-blue-50 text-blue-700 border-blue-200',
  Read: 'bg-gray-50 text-gray-700 border-gray-200',
  Replied: 'bg-green-50 text-green-700 border-green-200',
  Archived: 'bg-slate-50 text-slate-500 border-slate-200',
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getContacts({ page, limit: 10, search, status: statusFilter });
      setContacts(res.data.data.contacts);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchContacts(1); };
  const handleFilter = (s) => { setStatusFilter(s); setTimeout(() => fetchContacts(1), 0); };

  const handleDelete = async () => {
    try {
      await adminService.deleteContact(deleteId);
      toast.success('Contact deleted');
      setDeleteId(null);
      fetchContacts(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const unreadCount = contacts.filter((c) => c.status === 'Unread').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} total messages {unreadCount > 0 && `· ${unreadCount} unread`}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, subject..." className="input-field pl-10" />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'Unread', 'Read', 'Replied', 'Archived'].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              statusFilter === s
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="p-4 font-medium text-gray-500">From</th>
                  <th className="p-4 font-medium text-gray-500">Subject</th>
                  <th className="p-4 font-medium text-gray-500">Status</th>
                  <th className="p-4 font-medium text-gray-500">Date</th>
                  <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id} className={`border-b border-gray-50 hover:bg-gray-50 ${c.status === 'Unread' ? 'bg-blue-50/30' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.status === 'Unread' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                          {c.status === 'Unread' ? <FiMail className="h-4 w-4" /> : <FiInbox className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className={`font-medium ${c.status === 'Unread' ? 'text-slate-900' : 'text-gray-700'}`}>{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-[200px] truncate">{c.subject || '(no subject)'}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${STATUS_COLORS[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{formatDate(c.createdAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/contacts/${c._id}`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><FiEye className="h-4 w-4" /></Link>
                        <button onClick={() => setDeleteId(c._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-400 text-sm">No messages found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchContacts} />
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Message" message="Are you sure you want to delete this message? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
};

export default AdminContacts;
