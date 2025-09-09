import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSimilarResumes } from '@/api/resumeApi';
import { IoLocationOutline } from 'react-icons/io5';
import { useResumeMetrics } from '@/hooks/resumes/useResumeMetrics';
import { useLikes } from '@/hooks/resumes/useLikes';
import { useComments } from '@/hooks/resumes/useComments';

function ResumeSuggestionCard({ resume }) {
  const navigate = useNavigate();
  const { likeCount } = useLikes(resume.uuid);
  const { commentCount } = useComments(resume.uuid);

  return (
    <div
      className='flex items-center gap-3 px-4 py-3 border border-gray-200 hover:shadow-md hover:border-primary cursor-pointer transition rounded-xl'
      onClick={() => navigate(`/resumedetails/${resume.uuid}`)}
    >
      <div className='h-[65px] w-[65px] bg-gray-100 rounded-xl flex items-center justify-center font-bold text-xl text-primary border border-gray-300'>
        {resume.avatar ? (
          <img
            src={resume.avatar}
            alt={resume.name}
            className='h-[65px] w-[65px] object-cover rounded-xl'
          />
        ) : (
          resume.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
        )}
      </div>
      <div className='flex flex-col items-start'>
        <span className='font-bold text-sm capitalize'>{resume.name.toLowerCase()}</span>
        <span className='text-gray-500 text-sm'>
          <div className='flex items-center justify-center gap-1 text-sm -translate-x-0.5'>
            <IoLocationOutline className='text-[16px]' />
            <span>{resume.address?.city}</span>
          </div>
        </span>
        <div className='flex gap-2 mt-1 text-sm'>
          <div className='flex gap-[2px] items-center text-primary font-bold'>
            <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
            <span>{likeCount}</span>
          </div>
          <div className='flex gap-[2px] items-center text-primary font-bold'>
            <FontAwesomeIcon icon='fa-regular fa-comment' />
            <span>{commentCount}</span>
          </div>
          {/* <div className='flex gap-[2px] items-center text-primary font-bold'>
            <FontAwesomeIcon icon='fa-solid fa-briefcase' />
            <span>{resume.yearsOfExperience}</span>
          </div>
          <div className='flex gap-[2px] items-center text-primary font-bold'>
            <FontAwesomeIcon icon='fa-solid fa-diagram-project' />
            <span>{resume.projects?.length || 0}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default function ResumeSuggestionsSidebar({ resume, similarResumes }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  // const { downloadResume } = useResumeActions();
  const [searchParams] = useSearchParams();

  // Calculate top category using the same logic as ResumeMainInfo
  const { topCategory } = useResumeMetrics(resume, searchParams);

  // Fetch similar resumes based on top category
  useEffect(() => {
    async function fetchSimilarResumes() {
      if (!resume.uuid || !topCategory) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching similar resumes for category:', topCategory);
        const { data } = await getSimilarResumes(resume.uuid, topCategory);
        console.log('Received similar resumes:', data);
        setSuggestions(data || []);
      } catch (error) {
        console.error('Failed to fetch similar resumes:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilarResumes();
  }, [resume.uuid, topCategory]);

  // const handleDownload = () => {
  //   downloadResume(resume.uuid);
  // };

  return (
    <div>
      <div className='sticky top-30'>
        <h2 className='font-bold text-lg mb-3'>Similar Resumes</h2>
        <div className='flex flex-col gap-3'>
          {loading ? (
            <div className='text-center py-4 text-gray-500'>Loading similar resumes...</div>
          ) : suggestions.length > 0 ? (
            suggestions.slice(0, 4).map(r => (
              <ResumeSuggestionCard
                key={r.uuid}
                resume={r}
              />
            ))
          ) : (
            <div className='text-center py-4 text-gray-500'>
              {topCategory
                ? `No similar resumes found for "${topCategory}"`
                : 'No category information available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
