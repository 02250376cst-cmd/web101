import api from '@/lib/api-config';

export const userService = {
  getAllUsers: () => api.get('/users'),
  getProfile: (id) => api.get(`/users/${id}`),
  getProfileWithFollowing: (id) => api.get(`/users/${id}/following`),
  followUser: (id) => api.post(`/users/${id}/follow`),
  getMe: () => api.get('/users/me'),
};