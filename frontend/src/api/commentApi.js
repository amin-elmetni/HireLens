import api from './index';

const COMMENT_BASE = '/api/comments';

export const getCommentCount = resumeId => {
  return api.get(`${COMMENT_BASE}/count/${resumeId}`);
};
