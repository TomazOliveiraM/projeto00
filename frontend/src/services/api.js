import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL absoluta para o backend em desenvolvimento
});

// Interceptor para adicionar o token de autenticação em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
