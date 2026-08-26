import { useState, useEffect } from 'react';
import { adminService } from '../../services/endpoints';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', usageLimit: '', expiresAt: '' });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCoupons();
      setCoupons(res.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue || !form.expiresAt) return toast.error('Code, discount, and expiry are required');
    setSaving(true);
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), minPurchase: Number(form.minPurchase) || 0, maxDiscount: Number(form.maxDiscount) || 0, usageLimit: Number(form.usageLimit) || 0 };
      if (editId) {
        await adminService.updateCoupon(editId, payload);
        toast.success('Coupon updated');
      } else {
        await adminService.createCoupon(payload);
        toast.success('Coupon created');
      }
      setShowForm(false); setEditId(null);
      setForm({ code: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', usageLimit: '', expiresAt: '' });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, minPurchase: c.minPurchase || '', maxDiscount: c.maxDiscount || '', usageLimit: c.usageLimit || '', expiresAt: c.expiresAt?.slice(0, 10) || '' });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try { await adminService.deleteCoupon(deleteId); toast.success('Coupon deleted'); setDeleteId(null); fetchCoupons(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ code: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', usageLimit: '', expiresAt: '' }); }} className="btn-primary flex items-center gap-2">
          {showForm ? <FiX className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Code *</label><input name="code" value={form.code} onChange={handleChange} className="input-field" placeholder="SAVE10" /></div>
            <div><label className="block text-sm font-medium mb-1">Type *</label><select name="discountType" value={form.discountType} onChange={handleChange} className="input-field"><option value="percentage">Percentage</option><option value="fixed">Fixed (Rs.)</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Discount Value *</label><input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} className="input-field" min="0" /></div>
            <div><label className="block text-sm font-medium mb-1">Min Purchase</label><input name="minPurchase" type="number" value={form.minPurchase} onChange={handleChange} className="input-field" min="0" /></div>
            <div><label className="block text-sm font-medium mb-1">Max Discount</label><input name="maxDiscount" type="number" value={form.maxDiscount} onChange={handleChange} className="input-field" min="0" /></div>
            <div><label className="block text-sm font-medium mb-1">Usage Limit</label><input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} className="input-field" min="0" /></div>
            <div><label className="block text-sm font-medium mb-1">Expires At *</label><input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} className="input-field" /></div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-4 flex items-center gap-2">
            <FiSave className="h-4 w-4" /> {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="p-4 font-medium text-gray-500">Code</th>
                  <th className="p-4 font-medium text-gray-500">Type</th>
                  <th className="p-4 font-medium text-gray-500">Value</th>
                  <th className="p-4 font-medium text-gray-500">Min Purchase</th>
                  <th className="p-4 font-medium text-gray-500">Usage</th>
                  <th className="p-4 font-medium text-gray-500">Expires</th>
                  <th className="p-4 font-medium text-gray-500">Status</th>
                  <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-mono font-medium">{c.code}</td>
                    <td className="p-4 capitalize">{c.discountType}</td>
                    <td className="p-4">{c.discountType === 'percentage' ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}</td>
                    <td className="p-4">Rs. {c.minPurchase || 0}</td>
                    <td className="p-4">{c.usedCount}/{c.usageLimit || '∞'}</td>
                    <td className="p-4 text-xs">{formatDate(c.expiresAt)}</td>
                    <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(c)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><FiEdit2 className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteId(c._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Coupon" message="Are you sure you want to delete this coupon?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
};

export default AdminCoupons;
