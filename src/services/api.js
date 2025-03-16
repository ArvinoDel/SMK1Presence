import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },
  register: (userData) => api.post('/auth/register', userData),
};

export const qrcodeAPI = {
  generate: () => api.post('/qrcode/generate'),
  getMyQRCode: () => api.get('/qrcode/my-qrcode'),
};

export const absensiAPI = {
  scan: (qrData) => api.post('/absensi/scan', { qrData }),
  getMyAbsensi: () => api.get('/absensi/fetch'),
};

export const siswaAPI = {
  getProfile: () => api.get('/siswa/profile'),
  updateProfile: (data) => api.put('/siswa/profile', data)
};

export const guruAPI = {
  getProfile: () => api.get('/guru/profile'),
  updateProfile: (data) => api.put('/guru/profile', data)
};

export default api; 