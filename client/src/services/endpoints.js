import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
};

export const categoryService = {
  getCategories: (params) => api.get('/categories', { params }),
};

export const heroBannerService = {
  getActive: () => api.get('/hero-banners'),
};

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
};

export const paymentService = {
  initiateKhalti: (data) => api.post('/payments/khalti/initiate', data),
  verifyKhalti: (data) => api.post('/payments/khalti/verify', data),
};

export const reviewService = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getMyReview: (productId) => api.get(`/reviews/my-review/${productId}`),
};

export const couponService = {
  validate: (data) => api.post('/coupons/validate', data),
  apply: (data) => api.post('/coupons/apply', data),
};

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData);
  },
};

export const contactService = {
  submit: (data) => api.post('/contacts', data),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  updatePaymentStatus: (id, data) => api.put(`/admin/orders/${id}/payment-status`, data),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  reorderCategories: (orderedIds) => api.put('/admin/categories/reorder', { orderedIds }),
  getHeroBanners: () => api.get('/admin/hero-banners'),
  createHeroBanner: (data) => api.post('/admin/hero-banners', data),
  updateHeroBanner: (id, data) => api.put(`/admin/hero-banners/${id}`, data),
  deleteHeroBanner: (id) => api.delete(`/admin/hero-banners/${id}`),
  reorderHeroBanners: (orderedIds) => api.put('/admin/hero-banners/reorder', { orderedIds }),
  toggleHeroBanner: (id) => api.put(`/admin/hero-banners/${id}/toggle`),
  getCoupons: () => api.get('/coupons', {}),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  getContacts: (params) => api.get('/admin/contacts', { params }),
  getContact: (id) => api.get(`/admin/contacts/${id}`),
  updateContact: (id, data) => api.put(`/admin/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
};
