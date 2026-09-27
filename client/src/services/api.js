import axios from 'axios';

const getApiUrl = () => {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : (typeof process !== 'undefined' ? process.env?.VITE_API_URL : null);
    
  if (!envUrl || typeof envUrl !== 'string') {
    return 'http://localhost:5000/api';
  }
  const cleanUrl = envUrl.replace(/^VITE_API_URL=/, '').trim();
  return cleanUrl || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = (typeof window !== 'undefined')
    ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
    : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile')
};

export const cloudinaryAPI = {
  getSignature: (folder = 'studio-y7/gallery') => api.post('/cloudinary/signature', { folder })
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  upload: (data) => api.post('/gallery', data),
  saveMetadata: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
  reorder: (data) => api.put('/gallery/reorder/all', data)
};

export const heroAPI = {
  get: () => api.get('/hero'),
  upload: (data) => api.post('/hero', data),
  saveMetadata: (data) => api.post('/hero', data),
  delete: (id) => api.delete(`/hero/${id}`)
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getNewCount: () => api.get('/bookings/new/count'),
  markAsViewed: () => api.put('/bookings/new/mark-viewed'),
  updateStatus: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  createPayment: (data) => api.post('/bookings/payment/create', data),
  verifyPayment: (data) => api.post('/bookings/payment/verify', data)
};

export const contactAPI = {
  create: (data) => api.post('/contacts', data),
  getAll: () => api.get('/contacts'),
  updateStatus: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`)
};

export const testimonialAPI = {
  getAll: () => api.get('/testimonials'),
  getAdminAll: () => api.get('/testimonials/admin'),
  submit: (formData) => api.post('/testimonials/submit', formData),
  create: (formData) => api.post('/testimonials', formData),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`)
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  getAdminAll: () => api.get('/services/admin'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
};

export const videoAPI = {
  getAll: () => api.get('/videos'),
  getAdminAll: () => api.get('/videos/admin'),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`)
};

export const pricingAPI = {
  getAll: () => api.get('/pricing'),
  create: (data) => api.post('/pricing', data),
  update: (id, data) => api.put(`/pricing/${id}`, data),
  delete: (id) => api.delete(`/pricing/${id}`)
};

export const contentAPI = {
  getAll: () => api.get('/content'),
  get: (section) => api.get(`/content/${section}`),
  update: (section, data) => api.put(`/content/${section}`, data)
};

export default api;

