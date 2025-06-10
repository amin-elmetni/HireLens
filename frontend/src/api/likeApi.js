import api from './index';

export const getResumeByUuid = uuid => api.get(`/api/resumes/uuid/${uuid}`);

export const getLikeCount = resumeId => api.get(`/api/likes/count/${resumeId}`);

export const checkIfLiked = (userId, resumeId) => api.get(`/api/likes/check/${userId}/${resumeId}`);

export const likeResume = (userId, resumeId) => api.post(`/api/likes`, { userId, resumeId });

export const unlikeResume = (userId, resumeId) => api.delete(`/api/likes/${userId}/${resumeId}`);
