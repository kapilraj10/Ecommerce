import { useRef } from 'react';
import { uploadService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';

const MultiImageUploader = ({ value = [], onChange, label, max = 5 }) => {
  const inputRef = useRef(null);
  const uploadingRef = useRef(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    uploadingRef.current = true;
    try {
      const uploads = await Promise.all(files.map((file) => uploadService.uploadImage(file)));
      const urls = uploads.map((res) => res.data.data.url);
      const next = [...value, ...urls].slice(0, max);
      onChange(next);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      uploadingRef.current = false;
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (idx) => onChange(value.filter((_, i) => i !== idx));

  const slots = [...value, ...Array(Math.max(0, max - value.length)).fill(null)];

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {slots.map((url, i) => url ? (
          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
            <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-gray-900/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label={`Remove image ${i + 1}`}
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50/40 transition-colors"
          >
            <FiPlus className="h-5 w-5 mb-1" />
            <span className="text-[11px]">Add image</span>
          </button>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <FiUpload className="h-3 w-3" /> Upload up to {max} images. PNG, JPG, WebP up to 5MB each.
      </p>
    </div>
  );
};

export default MultiImageUploader;