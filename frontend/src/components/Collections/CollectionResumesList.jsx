import React, { useEffect, useState } from 'react';
import { getItemsByCollection } from '@/api/collectionItemApi';
import { getResumeByUuid, getResumeById } from '@/api/resumeApi';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';
import ResumeItem from './ResumeItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
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
