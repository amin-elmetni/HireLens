import api from './index';

export const getCommentCount = resumeId => {
  return api.get(`/api/comments/count/${resumeId}`);
};
