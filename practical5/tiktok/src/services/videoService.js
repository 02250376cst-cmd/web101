import api from '@/lib/api-config';

export const videoService = {
  // Updated for cursor-based pagination
  getAllVideos: ({ cursor } = {}) => {
    const params = new URLSearchParams({ limit: '5' });
    if (cursor) params.append('cursor', cursor);
    return api.get(`/videos?${params}`);
  },

  getFollowingVideos: ({ cursor } = {}) => {
    const params = new URLSearchParams({ limit: '5' });
    if (cursor) params.append('cursor', cursor);
    return api.get(`/videos/following?${params}`);
  },

  uploadVideo: (formData) =>
    api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  likeVideo: (id) => api.post(`/videos/${id}/like`),
  getComments: (id) => api.get(`/videos/${id}/comments`),
  addComment: (id, text) => api.post(`/videos/${id}/comments`, { text }),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
};