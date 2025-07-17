import axios from 'axios';
import { getToken } from '@/utils/tokenUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the token
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
