import { useState, useEffect } from 'react';
import { adminService, categoryService } from '../../services/endpoints';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiChevronUp, FiChevronDown,
  FiToggleLeft, FiToggleRight,
} from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories({ includeInactive: true });
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setName('');
    setImage('');
    setActive(true);
    setOrder(0);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    setSaving(true);
    const payload = { name, image, active, order: Number(order) || 0 };
    try {
      if (editId) {
        await adminService.updateCategory(editId, payload);
        toast.success('Category updated');
      } else {
        await adminService.createCategory(payload);
        toast.success('Category created');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setImage(cat.image || '');
    setActive(cat.active);
    setOrder(cat.order ?? 0);
    setShowForm(true);
  };

  const handleToggle = async (cat) => {
    try {
      await adminService.updateCategory(cat._id, { active: !cat.active });
      toast.success(cat.active ? 'Category deactivated' : 'Category activated');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setCategories(reordered);
    try {
      await adminService.reorderCategories(reordered.map((c) => c._id));
      toast.success('Order updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reorder');
      fetchCategories();
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteCategory(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => { if (showForm) resetForm(); else { setEditId(null); setName(''); setImage(''); setActive(true); setOrder(categories.length); setShowForm(true); } }} className="btn-primary flex items-center gap-2">
          {showForm ? <FiX className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Enter category name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="input-field" min="0" />
            </div>
          </div>
          <ImageUploader label="Category Image" value={image} onChange={setImage} aspect="aspect-square" />
          <div className="flex items-center gap-3">
            <input id="category-active" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" />
            <label htmlFor="category-active" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <FiSave className="h-4 w-4" /> {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="p-4 font-medium text-gray-500">Image</th>
                <th className="p-4 font-medium text-gray-500">Name</th>
                <th className="p-4 font-medium text-gray-500">Products</th>
                <th className="p-4 font-medium text-gray-500">Order</th>
                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat._id} className={`border-b border-gray-50 hover:bg-gray-50 ${!cat.active ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold">{cat.name[0]}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{cat.name}</p>
                    {!cat.active && <span className="text-xs text-gray-400">Inactive</span>}
                  </td>
                  <td className="p-4 text-gray-600">{cat.productCount ?? 0}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{cat.order ?? i}</span>
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><FiChevronUp className="h-4 w-4" /></button>
                      <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><FiChevronDown className="h-4 w-4" /></button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggle(cat)} title={cat.active ? 'Deactivate' : 'Activate'} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        {cat.active ? <FiToggleRight className="h-5 w-5 text-blue-600" /> : <FiToggleLeft className="h-5 w-5" />}
                      </button>
                      <button onClick={() => handleEdit(cat)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><FiEdit2 className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteId(cat._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Category" message="Are you sure you want to delete this category?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
};

export default AdminCategories;
