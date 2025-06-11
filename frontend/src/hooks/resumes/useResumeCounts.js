import { useState, useEffect } from 'react';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';
import { getResumeByUuid } from '@/api/resumeApi';

export function useResumeCounts(resumes) {
  const [resumeCounts, setResumeCounts] = useState({});
  useEffect(() => {
    if (!resumes.length) return;
    let cancelled = false;
    const fetchCounts = async () => {
      const counts = {};
      await Promise.all(
        resumes.map(async resume => {
          try {
            const { data: resumeMeta } = await getResumeByUuid(resume.uuid);
            if (!resumeMeta?.id) return;
            const [likesRes, commentsRes] = await Promise.all([
              getLikeCount(resumeMeta.id),
              getCommentCount(resumeMeta.id),
            ]);
            counts[resume.uuid] = {
              likes: likesRes.data ?? 0,
              comments: commentsRes.data ?? 0,
            };
          } catch {
            counts[resume.uuid] = { likes: 0, comments: 0 };
          }
        })
      );
      if (!cancelled) setResumeCounts(counts);
    };
    fetchCounts();
    return () => {
      cancelled = true;
    };
  }, [resumes]);
  return resumeCounts;
}
