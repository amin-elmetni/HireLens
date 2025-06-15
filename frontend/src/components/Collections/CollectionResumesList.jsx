import React, { useEffect, useState } from 'react';
import { getItemsByCollection } from '@/api/collectionItemApi';
import { getResumeByUuid } from '@/api/resumeApi';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';
import ResumeItem from './ResumeItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

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
            const { data: resume } = await getResumeByUuid(
              item.resumeId ?? item.resumeUUID ?? item.resumeUuid
            );
            const [likesRes, commentsRes] = await Promise.all([
              getLikeCount(resume.id),
              getCommentCount(resume.id),
            ]);
            const categories = resume.categories || [];
            const topCategory = categories.length
              ? categories.reduce((prev, curr) => (curr.score > prev.score ? curr : prev)).name
              : 'Uncategorized';
            return {
              uuid: resume.uuid,
              name: resume.name,
              topCategory,
              lastUpdated: resume.lastUpdated,
              likes: likesRes.data ?? 0,
              comments: commentsRes.data ?? 0,
              yearsOfExperience: resume.yearsOfExperience,
              experiencesCount: (resume.experiences || []).length,
              projectsCount: (resume.projects || []).length,
            };
          })
        );
        if (!cancelled) setResumes(resumesWithData);
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
    <div>
      <button
        onClick={onBack}
        className='mb-4 text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2'
      >
        <FontAwesomeIcon icon='fa-solid fa-arrow-left' />
        Back to Collections
      </button>
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
