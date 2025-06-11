import { useEffect, useState } from 'react';
import {
  getResumeByUuid,
  getLikeCount,
  checkIfLiked,
  likeResume,
  unlikeResume,
} from '@/api/likeApi';
import { getUser } from '@/utils/userUtils';

export const useLikes = uuid => {
  const user = getUser();
  const [resumeId, setResumeId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!uuid || !user) return;

    const fetchLikeData = async () => {
      try {
        const { data: resume } = await getResumeByUuid(uuid);
        if (!resume?.id) return;
        setResumeId(resume.id);

        const [countRes, likedRes] = await Promise.all([
          getLikeCount(resume.id),
          checkIfLiked(user.id, resume.id),
        ]);

        setLikeCount(countRes.data);
        setLiked(likedRes.data);
      } catch (err) {
        console.error('Error fetching like data:', err);
      }
    };

    fetchLikeData();
  }, [uuid]);

  const toggleLike = async () => {
    if (!resumeId || !user) return;

    try {
      if (liked) {
        await unlikeResume(user.id, resumeId);
        setLikeCount(prev => prev - 1);
      } else {
        await likeResume(user.id, resumeId);
        setLikeCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return { liked, likeCount, toggleLike };
};
