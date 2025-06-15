import React, { useEffect, useState } from 'react';
import { getItemsByCollection } from '@/api/collectionItemApi';
import { getResumeByUuid, getResumeById, getResumeMetadataByUuid } from '@/api/resumeApi';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';
import ResumeItem from './ResumeItem';
import BackCancelButton from '../ui/BackCancelButton';

export default function CollectionResumesList({ collection, onBack }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const { data: items } = await getItemsByCollection(collection.id);

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

            // Always get metadata by uuid if available
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

            // Use metadata values if available, otherwise fall back to resume
            const categories = metadata?.categories || [];
            console.log('Categories:', categories);
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
              // add any other metadata fields you want
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
  }, [collection.id]);

  return (
    <div className='-translate-y-4'>
      <BackCancelButton
        onClick={onBack}
        icon='fa-solid fa-arrow-left'
        text='Back to Collections'
        className='mb-4'
        ariaLabel='Close'
      />
      <h2 className='text-xl font-semibold mb-4'>
        Resumes in: <span className='text-primary'>{collection.name}</span>
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : resumes.length === 0 ? (
        <div className='text-gray-400'>No resumes in this collection.</div>
      ) : (
        <ul className='divide-y divide-gray-200'>
          {resumes.map(r => (
            <ResumeItem
              key={r.uuid}
              {...r}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
