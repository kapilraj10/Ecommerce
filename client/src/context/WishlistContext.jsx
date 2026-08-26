import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setItems(res.data.data.products || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) { toast.error('Please login first'); return false; }
    try {
      const res = await api.post('/wishlist/toggle', { productId });
      setItems(res.data.data.products || []);
      const isAdded = res.data.data.products.some((p) => p._id === productId);
      toast.success(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
      return isAdded;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
      return false;
    }
  }, [isAuthenticated]);

  const isWishlisted = useCallback((productId) => {
    return items.some((p) => p._id === productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, loading, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
