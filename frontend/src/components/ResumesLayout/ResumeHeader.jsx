import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MatchingScoreCircle from '@/components/ResumesLayout/MatchingScoreCircle';

const getInitials = name =>
  name
    ?.split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();

const ResumeHeader = ({ name, title, matchingScore, date }) => (
  <div className='flex flex-col'>
    <div className='flex items-center justify-between mb-2'>
      <p className='text-gray-400 font-light text-[11px]'>{date}</p>
      <FontAwesomeIcon
        icon='fa-ellipsis'
        className='text-gray-400'
      />
    </div>
    <div className='flex items-center gap-4 justify-between mb-4'>
      <div className='flex items-center gap-2'>
        <div className='w-11 h-11 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-widest'>
          {getInitials(name)}
        </div>
        <div className='flex flex-col'>
          <h3 className='font-medium text-xs capitalize'>{name?.toLowerCase()}</h3>
          <p className='text-primary text-xs capitalize'>{title?.toLowerCase()}</p>
        </div>
      </div>
      <MatchingScoreCircle percentage={matchingScore} />
    </div>
  </div>
);

export default ResumeHeader;
