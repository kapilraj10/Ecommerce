import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService, categoryService } from '../../services/endpoints';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', category: '', brand: '', stock: '', images: '',
  });

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      return toast.error('Please fill required fields');
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        stock: Number(form.stock) || 0,
        images: form.images ? form.images.split(',').map((u) => u.trim()).filter(Boolean) : [],
      };
      await adminService.createProduct(payload);
      toast.success('Product created');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-4 text-sm"><FiArrowLeft className="h-4 w-4" /> Back to Products</Link>
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className="input-field" min="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
            <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className="input-field" min="0" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              <option value="">Select category</option>
              {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" min="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
          <input name="images" value={form.images} onChange={handleChange} className="input-field" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <FiSave className="h-4 w-4" /> {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProduct;
