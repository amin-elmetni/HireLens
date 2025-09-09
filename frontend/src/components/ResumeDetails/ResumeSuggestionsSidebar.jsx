import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeSuggestionCard({ resume }) {
  const navigate = useNavigate();
  return (
    <div
      className='flex items-center gap-3 px-4 py-3 border border-gray-200 hover:shadow-md hover:border-primary cursor-pointer transition rounded-xl'
      onClick={() => navigate(`/resumedetails/${resume.id}`)}
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
        <span className='font-bold text-sm'>{resume.name}</span>
        <span className='text-gray-400 text-sm'>{resume.city}</span>
        <div className='flex gap-2 mt-1 text-sm'>
          <div className='flex gap-[2px] items-center text-primary font-bold'>
            <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
            <span>{resume.experience}</span>
          </div>
          <div className='flex gap-[2px] items-center text-primary font-bold'>
            <FontAwesomeIcon icon='fa-regular fa-comment' />
            <span>{resume.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeSuggestionsSidebar({ resume, similarResumes }) {
  return (
    <div>
      <div className='sticky top-30 flex flex-col gap-4'>
        <a
          href={`/api/resumes/download/${resume.uuid}`}
          target='_blank'
          className='flex items-center justify-center w-full bg-primary hover:bg-[#0891b2] text-white py-4 rounded-2xl text-lg font-bold shadow transition'
          download
        >
          <FontAwesomeIcon
            icon='fa-solid fa-circle-down'
            className='mr-4 text-xl'
          />
          Download Resume
        </a>

        <div className='mt-4'>
          <h2 className='font-bold text-lg mb-3'>Similar Resumes</h2>
          <div className='flex flex-col gap-3'>
            {similarResumes.map(r => (
              <ResumeSuggestionCard
                key={r.id}
                resume={r}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
