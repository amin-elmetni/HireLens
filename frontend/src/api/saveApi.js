import api from './index';

export const saveResume = saveDto => {
  return api.post('/api/saves', saveDto);
};

export const unsaveResume = (userId, resumeId) => {
  return api.delete(`/api/saves/${userId}/${resumeId}`);
};

export const getSaveCount = resumeId => {
  return api.get(`/api/saves/count/${resumeId}`);
};

export const hasSavedResume = (userId, resumeId) => {
  return api.get(`/api/saves/check/${userId}/${resumeId}`);
};
