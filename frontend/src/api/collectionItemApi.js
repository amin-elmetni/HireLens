import api from './index';

const ITEM_BASE = '/api/collection-items';

export const addItemToCollection = data => api.post(ITEM_BASE, data);

export const getItemsByCollection = collectionId =>
  api.get(`${ITEM_BASE}/collection/${collectionId}`);

export const removeItemFromCollection = (collectionId, resumeId) =>
  api.delete(`${ITEM_BASE}/collection/${collectionId}/resume/${resumeId}`);
