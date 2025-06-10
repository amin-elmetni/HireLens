import api from './index';

const COLLECTION_BASE = '/api/collections';

export const createCollection = data => api.post(COLLECTION_BASE, data);

export const updateCollection = data => api.put(COLLECTION_BASE, data);

export const getUserCollections = userId => api.get(`${COLLECTION_BASE}/user/${userId}`);

export const getPublicCollections = () => api.get(`${COLLECTION_BASE}/public`);

export const getUserPublicCollections = userId =>
  api.get(`${COLLECTION_BASE}/public/user/${userId}`);

export const deleteCollection = id => api.delete(`${COLLECTION_BASE}/${id}`);
