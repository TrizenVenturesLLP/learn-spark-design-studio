
import axios, { AxiosRequestConfig } from 'axios';

// Base URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create axios instance with defaults
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Longer timeout for uploads (30 seconds)
  withCredentials: true
});

// Add request interceptor to attach auth token from localStorage if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Extend AxiosRequestConfig to include onUploadProgress
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: {
    loaded: number;
    total?: number;
  }) => void;
}

export default axiosInstance;
