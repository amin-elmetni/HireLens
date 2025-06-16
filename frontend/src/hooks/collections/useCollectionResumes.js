import { useState, useEffect } from 'react';
import { getItemsByCollection } from '@/api/collectionItemApi';
import { getResumeByUuid, getResumeById, getResumeMetadataByUuid } from '@/api/resumeApi';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';

export default function useCollectionResumes(collectionId) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!collectionId) return;
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const { data: items } = await getItemsByCollection(collectionId);

        const resumesWithData = await Promise.all(
          items.map(async item => {
            let resume;
            if (item.resumeUuid || item.resumeUUID) {
              const res = await getResumeByUuid(item.resumeUuid || item.resumeUUID);
              resume = res.data;
            } else if (item.resumeId) {
              const res = await getResumeById(item.resumeId);
              resume = res.data;
            } else {
              return null;
            }
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
        if (!cancelled) setResumes(resumesWithData.filter(Boolean));
      } catch {
        if (!cancelled) setResumes([]);
      }
      setLoading(false);
    };
    fetchResumes();
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  return { resumes, loading };
}
