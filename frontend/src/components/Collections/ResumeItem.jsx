import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '@/utils/generalUtils';
import { getInitials } from '@/utils/generalUtils';

const StatItem = ({ icon, value, label }) => (
  <div className='flex items-center text-gray-600 font-medium'>
    <FontAwesomeIcon
      icon={icon}
      className='text-primary text-xs'
    />
    <span className='ml-1'>{value}</span>
    <span className='ml-[3px]'>{label}</span>
  </div>
);

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
  <li className='flex items-center justify-between py-4 gap-3 hover:bg-gray-50 transition-colors cursor-pointer px-8'>
    <div className='flex items-center gap-4'>
      <div className='w-17 h-17 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-widest text-2xl'>
        {getInitials(name)}
      </div>
      <div className='flex flex-col self-stretch justify-between'>
        <div className='flex flex-col gap-[1px]'>
          <div className='font-semibold'>{name}</div>
          <div className='text-xs text-primary font-medium capitalize'>
            {topCategory.toLowerCase()}
          </div>
        </div>
        <div className='flex  gap-4 text-[10px] mb-[2px]'>
          <StatItem
            label='Years'
            icon='fa-solid fa-briefcase'
            value={yearsOfExperience}
          />
          <StatItem
            label='Jobs'
            icon='fa-solid fa-building'
            value={experiencesCount}
          />
          <StatItem
            label='Projects'
            icon='fa-solid fa-diagram-project'
            value={projectsCount}
          />
        </div>
      </div>
    </div>
    <div className='flex flex-col self-stretch justify-between items-end'>
      <div className='flex flex-col items-end gap-[1px]'>
        <div className='text-xs text-gray-500 mb-1'>{formatDate(lastUpdated)}</div>
        <div className='flex gap-2 items-center text-xs text-gray-500'>
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
      </div>
      <button
        className='rounded-full hover:bg-gray-200 h-8 w-8 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer translate-y-2 translate-x-1'
        // onClick={e => e.stopPropagation()}
      >
        <FontAwesomeIcon icon='fa-solid fa-ellipsis' />
      </button>
    </div>
  </li>
);

export default ResumeItem;
