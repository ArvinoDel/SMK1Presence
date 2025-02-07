import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; 

const api = axios.create({
  baseURL: API_URL,
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
};

export const siswaAPI = {
  getProfile: () => api.get('/siswa/profile'),
  updateProfile: (data) => api.put('/siswa/profile', data)
};

export default api; 