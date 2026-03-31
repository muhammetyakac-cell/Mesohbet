import axios from 'axios';
import { apiUrl } from './supabase';

const api = axios.create({
  baseURL: apiUrl,
});

export const loginUser = async (nickname, password) => {
  const response = await api.post('/api/auth/login', { nickname, password });
  return response.data;
};

export const getRooms = async () => {
  const response = await api.get('/api/rooms');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const getMessages = async (roomSlug, limit = 50, offset = 0) => {
  const response = await api.get('/api/messages', {
    params: { room_slug: roomSlug, limit, offset },
  });
  return response.data;
};

export const sendMessage = async (userId, content, roomSlug) => {
  const response = await api.post('/api/messages', {
    user_id: userId,
    content,
    room_slug: roomSlug,
  });
  return response.data;
};

export default api;
