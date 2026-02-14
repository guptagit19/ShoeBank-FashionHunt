import axios from 'axios';

// TODO: Replace with your actual Render backend URL after deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add session ID to all requests
api.interceptors.request.use((config) => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('sessionId', sessionId);
    }
    config.headers['X-Session-Id'] = sessionId;

    // Add auth token for admin routes, auth verification, and file uploads
    const token = localStorage.getItem('adminToken');
    if (token && (
        config.url.startsWith('/admin') ||
        config.url === '/auth/verify' ||
        config.url.startsWith('/upload')
    )) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            if (window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Categories API
export const categoriesApi = {
    getAll: () => api.get('/categories'),
    getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Products API
export const productsApi = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getFeatured: () => api.get('/products/featured'),
};

// Cart API
export const cartApi = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart/add', data),
    update: (itemId, quantity) => api.put(`/cart/items/${itemId}`, null, { params: { quantity } }),
    remove: (itemId) => api.delete(`/cart/items/${itemId}`),
    clear: () => api.delete('/cart/clear'),
};

// Orders API
export const ordersApi = {
    create: (data) => api.post('/orders', data),
    getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
};

// Tracking API
export const trackingApi = {
    get: (orderNumber) => api.get(`/tracking/${orderNumber}`),
};

// Auth API
export const authApi = {
    login: (data) => api.post('/auth/login', data),
    verify: () => api.get('/auth/verify'),
};

// Admin API
export const adminApi = {
    // Dashboard
    getDashboard: () => api.get('/admin/dashboard'),

    // Categories
    getCategories: () => api.get('/admin/categories'),
    createCategory: (data) => api.post('/admin/categories', data),
    updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

    // Products
    getProducts: (params) => api.get('/admin/products', { params }),
    createProduct: (data) => api.post('/admin/products', data),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),

    // Orders
    getOrders: (params) => api.get('/admin/orders', { params }),
    getOrder: (id) => api.get(`/admin/orders/${id}`),
    updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, null, { params: { status } }),

    // Upload
    uploadImages: (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return api.post('/upload/images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

export default api;
