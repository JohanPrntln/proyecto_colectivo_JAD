// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Añadir token automáticamente si está en localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // o usa sessionStorage/env
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

export default api;
