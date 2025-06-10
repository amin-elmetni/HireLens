import api from './index';

const SAVE_BASE = '/api/saves';

export const saveResume = saveDto => {
  return api.post(SAVE_BASE, saveDto);
};

export const unsaveResume = (userId, resumeId) => {
  return api.delete(`${SAVE_BASE}/${userId}/${resumeId}`);
};

export const getSaveCount = resumeId => {
  return api.get(`${SAVE_BASE}/count/${resumeId}`);
};

export const hasSavedResume = (userId, resumeId) => {
  return api.get(`${SAVE_BASE}/check/${userId}/${resumeId}`);
};
