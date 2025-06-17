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
  const [refreshKey, setRefreshKey] = useState(0); // <-- force update

  const fetchBookmarkedResumes = useCallback(async () => {
    if (!user?.id) {
      setResumes([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getSavesByUser(user.id);
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
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Always fetch when mounted or refreshKey changes
  useEffect(() => {
    fetchBookmarkedResumes();
  }, [fetchBookmarkedResumes, refreshKey]);

  // Call this function to force refresh
  const refresh = () => setRefreshKey(k => k + 1);

  return { resumes, loading, refresh };
}
