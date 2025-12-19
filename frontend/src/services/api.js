import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url?.includes('/quizzes')) {
      const currentLang = localStorage.getItem('i18nextLng') || 'fr';
      const lang = currentLang.split('-')[0]; // Extract 'fr' from 'fr-FR'
      config.params = { ...config.params, lang };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

export const analysisAPI = {
  analyzeContent: (data) => api.post('/analysis/analyze', data),
  getUserAnalyses: (params) => api.get('/analysis/my-analyses', { params }),
  getAnalysisById: (id) => api.get(`/analysis/analysis/${id}`),
  getStats: () => api.get('/analysis/stats'),
};

export const quizAPI = {
  getAllQuizzes: (params) => api.get('/quizzes', { params }),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  submitQuiz: (data) => api.post('/quizzes/submit', data),
  getUserResults: (params) => api.get('/quizzes/results/my-results', { params }),
  getUserProgress: () => api.get('/quizzes/progress/my-progress'),
  createQuiz: (data) => api.post('/quizzes', data),
};

export const trustedSourceAPI = {
  getAllSources: (params) => api.get('/trusted-sources', { params }),
  getCategories: () => api.get('/trusted-sources/categories'),
  getCountries: () => api.get('/trusted-sources/countries'),
  createSource: (data) => api.post('/trusted-sources', data),
  updateSource: (id, data) => api.put(`/trusted-sources/${id}`, data),
  deleteSource: (id) => api.delete(`/trusted-sources/${id}`),
};

export default api;