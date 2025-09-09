import api from '@/api/index';

export const loginUser = credentials => api.post('/api/auth/login', credentials);

export const signupUser = userData => api.post('/api/users', userData);
