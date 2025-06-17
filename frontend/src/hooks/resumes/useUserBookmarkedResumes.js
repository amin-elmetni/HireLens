import { useState, useEffect, useCallback } from 'react';
import { getSavesByUser } from '@/api/saveApi';
import { getResumeById, getResumeMetadataByUuid } from '@/api/resumeApi';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';
import { getUser } from '@/utils/userUtils';

export default function useUserBookmarkedResumes() {
  const user = getUser();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getSavesByUser(user.id)
      .then(async ({ data }) => {
        const resumesWithMeta = await Promise.all(
          data.map(async save => {
            const { data: resume } = await getResumeById(save.resumeId);
            let metadata = null;
            if (resume.uuid) {
              try {
                const metaRes = await getResumeMetadataByUuid(resume.uuid);
                metadata = metaRes.data;
              } catch {}
            }
            const [likesRes, commentsRes] = await Promise.all([
              getLikeCount(resume.id),
              getCommentCount(resume.id),
            ]);
            const categories = metadata?.categories || [];
            const topCategory = categories.length
              ? categories.reduce((prev, curr) => (curr.score > prev.score ? curr : prev)).name
              : 'Uncategorized';
            return {
              uuid: resume.uuid,
              resumeId: resume.id,
              name: metadata?.name || resume.name,
              topCategory,
              lastUpdated: metadata?.lastUpdated || resume.lastUpdated,
              likes: likesRes.data ?? 0,
              comments: commentsRes.data ?? 0,
              yearsOfExperience: metadata?.yearsOfExperience,
              experiencesCount: metadata?.experiences?.length ?? 0,
              projectsCount: metadata?.projects?.length ?? 0,
            };
          })
        );
        setResumes(resumesWithMeta);
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const fetchBookmarkedResumes = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    getSavesByUser(user.id)
      .then(async ({ data }) => {
        // ...same as before...
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    fetchBookmarkedResumes();
  }, [fetchBookmarkedResumes]);

  return { resumes, loading, refresh: fetchBookmarkedResumes };
}
