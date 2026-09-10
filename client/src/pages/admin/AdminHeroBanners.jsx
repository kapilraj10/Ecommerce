import { useState, useEffect } from 'react';
import { adminService } from '../../services/endpoints';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiChevronUp, FiChevronDown,
  FiToggleLeft, FiToggleRight,
} from 'react-icons/fi';

const EMPTY_FORM = {
  badge: '',
  title: '',
  description: '',
  image: '',
  mobileImage: '',
  primaryText: 'Shop Now',
  primaryUrl: '/products',
  secondaryText: 'View Deals',
  secondaryUrl: '/products?search=deal',
  offerText: '',
  active: true,
  order: 0,
  startDate: '',
  endDate: '',
};

const AdminHeroBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await adminService.getHeroBanners();
      setBanners(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, order: banners.length });
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditId(b._id);
    setForm({
      badge: b.badge || '',
      title: b.title || '',
      description: b.description || '',
      image: b.image || '',
      mobileImage: b.mobileImage || '',
      primaryText: b.primaryText || '',
      primaryUrl: b.primaryUrl || '',
      secondaryText: b.secondaryText || '',
      secondaryUrl: b.secondaryUrl || '',
      offerText: b.offerText || '',
      active: b.active,
      order: b.order ?? 0,
      startDate: b.startDate ? b.startDate.slice(0, 10) : '',
      endDate: b.endDate ? b.endDate.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        active: !!form.active,
        order: Number(form.order) || 0,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };
      if (editId) {
        await adminService.updateHeroBanner(editId, payload);
        toast.success('Hero banner updated');
      } else {
        await adminService.createHeroBanner(payload);
        toast.success('Hero banner created');
      }
      resetForm();
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (b) => {
    try {
      await adminService.toggleHeroBanner(b._id);
      toast.success(b.active ? 'Banner deactivated' : 'Banner activated');
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= banners.length) return;
    const reordered = [...banners];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setBanners(reordered);
    try {
      await adminService.reorderHeroBanners(reordered.map((b) => b._id));
      toast.success('Order updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reorder');
      fetchBanners();
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteHeroBanner(deleteId);
      toast.success('Hero banner deleted');
      setDeleteId(null);
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hero Banners</h1>
        <button onClick={showForm ? resetForm : openCreate} className="btn-primary flex items-center gap-2">
          {showForm ? <FiX className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="YOUR TRUSTED TECH STORE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input name="badge" value={form.badge} onChange={handleChange} className="input-field" placeholder="PREMIUM TECH • BEST PRICES" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-field" placeholder="Short supporting text under the title" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader label="Hero Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} aspect="aspect-square" />
            <ImageUploader label="Mobile Image (optional)" value={form.mobileImage} onChange={(v) => setForm({ ...form, mobileImage: v })} aspect="aspect-square" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer / Discount Text</label>
              <input name="offerText" value={form.offerText} onChange={handleChange} className="input-field" placeholder="Up to 30% OFF" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input name="order" type="number" value={form.order} onChange={handleChange} className="input-field" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
              <input name="primaryText" value={form.primaryText} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button URL</label>
              <input name="primaryUrl" value={form.primaryUrl} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
              <input name="secondaryText" value={form.secondaryText} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button URL</label>
              <input name="secondaryUrl" value={form.secondaryUrl} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (optional)</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input id="banner-active" type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4" />
            <label htmlFor="banner-active" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <FiSave className="h-4 w-4" /> {saving ? 'Saving...' : editId ? 'Update Banner' : 'Create Banner'}
          </button>
        </form>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="p-4 font-medium text-gray-500">Image</th>
                <th className="p-4 font-medium text-gray-500">Title</th>
                <th className="p-4 font-medium text-gray-500">Status</th>
                <th className="p-4 font-medium text-gray-500">Order</th>
                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hero banners yet. Click "Add Banner" to create one.</td></tr>
              ) : banners.map((b, i) => (
                <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="w-20 h-12 rounded overflow-hidden bg-gray-100">
                      {b.image ? (
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">—</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{b.title || 'Untitled'}</p>
                    {b.badge && <p className="text-xs text-gray-500 uppercase tracking-wide">{b.badge}</p>}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{b.order ?? i}</span>
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><FiChevronUp className="h-4 w-4" /></button>
                      <button onClick={() => move(i, 1)} disabled={i === banners.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><FiChevronDown className="h-4 w-4" /></button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggle(b)} title={b.active ? 'Deactivate' : 'Activate'} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        {b.active ? <FiToggleRight className="h-5 w-5 text-blue-600" /> : <FiToggleLeft className="h-5 w-5" />}
                      </button>
                      <button onClick={() => openEdit(b)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><FiEdit2 className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteId(b._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Banner" message="Are you sure you want to delete this hero banner?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
};

export default AdminHeroBanners;
