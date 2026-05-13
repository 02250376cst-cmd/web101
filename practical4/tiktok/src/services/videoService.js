import api from '@/lib/api-config';

export const videoService = {
  getAllVideos: () => api.get('/videos'),
  getFollowingVideos: () => api.get('/videos/following'),
  uploadVideo: (formData) => api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  getComments: (id) => api.get(`/videos/${id}/comments`),
  addComment: (id, text) => api.post(`/videos/${id}/comments`, { text }),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
};