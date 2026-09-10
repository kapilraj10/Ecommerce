import { useState, useRef } from 'react';
import { uploadService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const ImageUploader = ({ value = '', onChange, label, aspect = 'aspect-video' }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      onChange(res.data.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className={`relative rounded-lg overflow-hidden border border-dashed border-gray-300 bg-gray-50 ${aspect}`}>
        {value ? (
          <>
            <img src={value} alt={label || 'uploaded'} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-900/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <FiX className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {uploading ? (
              <span className="text-sm font-medium">Uploading...</span>
            ) : (
              <>
                <FiUpload className="h-6 w-6 mb-1" />
                <span className="text-xs">Click to upload</span>
              </>
            )}
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
};

export default ImageUploader;
