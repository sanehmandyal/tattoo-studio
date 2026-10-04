import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ink_carvers_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept responses for centralized error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  toggleSaveDesign: (id) => api.post(`/auth/save-design/${id}`),
  toggleFavoriteArtist: (id) => api.post(`/auth/favorite-artist/${id}`),
  getAllCustomers: () => api.get('/auth/customers'),
};

// Artists Endpoints
export const artistsAPI = {
  getAll: (admin = false) => api.get(`/artists${admin ? '?admin=true' : ''}`),
  getBySlug: (slugOrId) => api.get(`/artists/${slugOrId}`),
  create: (data) => api.post('/artists', data),
  update: (id, data) => api.put(`/artists/${id}`, data),
  delete: (id) => api.delete(`/artists/${id}`),
};

// Portfolio Endpoints
export const portfolioAPI = {
  getAll: (params) => api.get('/portfolio', { params }),
  getById: (id) => api.get(`/portfolio/${id}`),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
};

// Designs Endpoints (3D & Studio Placement)
export const designsAPI = {
  getAll: (params) => api.get('/designs', { params }),
  getById: (id) => api.get(`/designs/${id}`),
  create: (data) => api.post('/designs', data),
  update: (id, data) => api.put(`/designs/${id}`, data),
  delete: (id) => api.delete(`/designs/${id}`),
  toggleLike: (id) => api.post(`/designs/${id}/like`),
};

// Bookings Endpoints
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  reschedule: (id, data) => api.patch(`/bookings/${id}/reschedule`, data),
  getStats: () => api.get('/bookings/stats'),
};

// Availability & Slots Endpoints
export const availabilityAPI = {
  getSlots: (artistId, date) => api.get('/availability/slots', { params: { artistId, date } }),
  blockDate: (data) => api.post('/availability/block', data),
};

// Blogs Endpoints
export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slugOrId) => api.get(`/blogs/${slugOrId}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// Contact & Inquiries Endpoints
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  updateStatus: (id, data) => api.patch(`/contact/${id}/status`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Site Settings Endpoints
export const settingsAPI = {
  getPublic: () => api.get('/settings/public'),
  getAdmin: () => api.get('/settings/admin'),
  update: (data) => api.put('/settings', data),
};

// Aftercare Endpoints
export const aftercareAPI = {
  getAll: () => api.get('/aftercare'),
  create: (data) => api.post('/aftercare', data),
  update: (id, data) => api.put(`/aftercare/${id}`, data),
  delete: (id) => api.delete(`/aftercare/${id}`),
};

// Reviews & Google Testimonials Endpoints
export const reviewsAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Upload Endpoints
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
