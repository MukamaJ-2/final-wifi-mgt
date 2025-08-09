import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminData');
      window.location.href = '/';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        type: 'network'
      });
    }

    // Return structured error
    return Promise.reject({
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    });
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile'
  },
  
  // Guest user endpoints
  guestUsers: {
    create: '/guest-users',
    list: '/guest-users',
    update: (id) => `/guest-users/${id}`,
    delete: (id) => `/guest-users/${id}`,
    toggleStatus: (id) => `/guest-users/${id}/toggle-status`
  }
};