import axios from 'axios';
import { apiUrl } from './supabase';

const api = axios.create({
  baseURL: apiUrl,
});

export const loginUser = async (nickname) => {
  const response = await api.post('/api/auth/login', { nickname });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const getMessages = async (limit = 50, offset = 0) => {
  const response = await api.get('/api/messages', {
    params: { limit, offset },
  });
  return response.data;
};

export const sendMessage = async (userId, content) => {
  const response = await api.post('/api/messages', {
    user_id: userId,
    content,
  });
  return response.data;
};

export default api;
