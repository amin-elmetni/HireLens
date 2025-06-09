// src/hooks/useComments.js
import { useEffect, useState } from 'react';
import { getCommentCount } from '@/api/commentApi';
import { getResumeByUuid } from '@/api/likeApi';

export const useComments = uuid => {
  const [resumeId, setResumeId] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!uuid) return;

    const fetchCommentData = async () => {
      try {
        const { data: resume } = await getResumeByUuid(uuid);
        if (!resume?.id) return;
        setResumeId(resume.id);

        const { data } = await getCommentCount(resume.id);
        setCommentCount(data);
      } catch (error) {
        console.error('Failed to fetch comment count', error);
      }
    };

    fetchCommentData();
  }, [uuid]);

  return { commentCount };
};
