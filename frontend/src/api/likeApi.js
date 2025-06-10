import api from './index';

const LIKE_BASE = '/api/likes';

export const getResumeByUuid = uuid => api.get(`/api/resumes/uuid/${uuid}`);

export const getLikeCount = resumeId => api.get(`${LIKE_BASE}/count/${resumeId}`);

export const checkIfLiked = (userId, resumeId) =>
  api.get(`${LIKE_BASE}/check/${userId}/${resumeId}`);

export const likeResume = (userId, resumeId) => api.post(LIKE_BASE, { userId, resumeId });

export const unlikeResume = (userId, resumeId) => api.delete(`${LIKE_BASE}/${userId}/${resumeId}`);
