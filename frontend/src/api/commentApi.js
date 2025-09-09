export const getCommentsByResumeId = (resumeId, userId = null) => {
  const headers = {};
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return api.get(`${COMMENT_BASE}/resume/${resumeId}`, { headers });
};
export const deleteComment = (commentId, userId, isAdmin = false) => {
  return api.delete(`${COMMENT_BASE}/${commentId}`, {
    headers: {
      'X-User-Id': userId,
      'X-Is-Admin': isAdmin,
    },
  });
};

export const updateComment = (commentId, newContent) => {
  // Send as raw string, not object
  return api.put(`${COMMENT_BASE}/${commentId}`, newContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
import api from './index';

const COMMENT_BASE = '/api/comments';

export const getCommentCount = resumeId => {
  return api.get(`${COMMENT_BASE}/count/${resumeId}`);
};

export const likeComment = (commentId, userId) => {
  return api.post(
    `${COMMENT_BASE}/${commentId}/like`,
    {},
    {
      headers: {
        'X-User-Id': userId,
      },
    }
  );
};

export const dislikeComment = (commentId, userId) => {
  return api.post(
    `${COMMENT_BASE}/${commentId}/dislike`,
    {},
    {
      headers: {
        'X-User-Id': userId,
      },
    }
  );
};

export const postComment = comment => {
  return api.post(`${COMMENT_BASE}`, comment);
};
