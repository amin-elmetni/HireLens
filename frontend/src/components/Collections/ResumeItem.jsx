import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '@/utils/formatDate';

const ResumeItem = ({
  name,
  topCategory,
  lastUpdated,
  likes,
  comments,
  yearsOfExperience,
  experiencesCount,
  projectsCount,
}) => (
  <li className='flex items-center justify-start py-3'>
    <div className='w-1/4 font-semibold'>{name}</div>
    <div className='w-1/6'>{topCategory}</div>
    {/* <div className='w-1/6 text-gray-500'>{formatDate(lastUpdated)}</div> */}
    <div className='w-1/6 flex gap-2 items-center'>
      <span
        title='Likes'
        className='flex items-center gap-1'
      >
        <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
        {likes}
      </span>
      <span
        title='Comments'
        className='flex items-center gap-1'
      >
        <FontAwesomeIcon icon='fa-regular fa-comment' />
        {comments}
      </span>
    </div>
    <div className='w-1/3 flex gap-4'>
      <span title='Years of experience'>{yearsOfExperience}y</span>
      <span title='Experiences'>{experiencesCount} exp</span>
      <span title='Projects'>{projectsCount} proj</span>
    </div>
  </li>
);

export default ResumeItem;
