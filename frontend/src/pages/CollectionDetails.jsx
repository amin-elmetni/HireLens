import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getItemsByCollection } from '@/api/collectionItemApi';
import { getResumeByUuid } from '@/api/resumeApi';
import { getLikeCount } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';
import { formatDate } from '@/utils/formatDate';

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        // Get resume items (these should have resume IDs or uuids)
        const { data: items } = await getItemsByCollection(collectionId);
        // Fetch full resume details for each item (assumes an array of resumeId or uuid)
        const resumesWithData = await Promise.all(
          items.map(async item => {
            const { data: resume } = await getResumeByUuid(
              item.resumeId ?? item.resumeUUID ?? item.resumeUuid
            );
            // Fetch likes/comments counts
            const [likesRes, commentsRes] = await Promise.all([
              getLikeCount(resume.id),
              getCommentCount(resume.id),
            ]);
            // Top category
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
        setResumes(resumesWithData);
      } catch (e) {
        setResumes([]);
      }
      setLoading(false);
    };
    fetchResumes();
  }, [collectionId]);

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold mb-6'>Resumes in Collection</h2>
      {loading ? (
        <div>Loading...</div>
      ) : resumes.length === 0 ? (
        <div>No resumes in this collection.</div>
      ) : (
        <ul className='divide-y divide-gray-200'>
          {resumes.map(r => (
            <li
              key={r.uuid}
              className='flex items-center py-4'
            >
              {/* Candidate Name */}
              <div className='w-2/6 font-semibold'>{r.name}</div>
              {/* Top Category */}
              <div className='w-1/6'>{r.topCategory}</div>
              {/* Last Updated */}
              <div className='w-1/6 text-gray-500'>{formatDate(r.lastUpdated)}</div>
              {/* Likes/Comments */}
              <div className='w-1/6 flex gap-2 items-center'>
                <span
                  title='Likes'
                  className='flex items-center gap-1'
                >
                  <i className='fa fa-thumbs-up text-yellow-500' />
                  {r.likes}
                </span>
                <span
                  title='Comments'
                  className='flex items-center gap-1'
                >
                  <i className='fa fa-comment text-primary' />
                  {r.comments}
                </span>
              </div>
              {/* Experience, #experiences, #projects */}
              <div className='w-1/6 flex gap-2'>
                <span title='Years of experience'>{r.yearsOfExperience}y</span>
                <span title='Experiences'>{r.experiencesCount} exp</span>
                <span title='Projects'>{r.projectsCount} proj</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CollectionDetail;
