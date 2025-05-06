import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001', // Update this with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;