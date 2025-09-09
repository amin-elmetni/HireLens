import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MatchingScoreCircle from '@/components/Resumes/ResumesLayout/MatchingScoreCircle';
import { getInitials } from '@/utils/generalUtils';
import DropdownMenu from '@/components/ui/DropdownMenu';

const ResumeHeader = ({
  name,
  title,
  matchingScore,
  date,
  onViewResume,
  onDownloadResume,
  onAddToCollection,
}) => {
  const ellipsisRef = useRef();

  const dropdownOptions = [
    {
      label: 'View Resume',
      value: 'view',
      icon: <FontAwesomeIcon icon='fa-regular fa-eye' />,
      onClick: onViewResume,
    },
    {
      label: 'Download Resume',
      value: 'download',
      icon: <FontAwesomeIcon icon='fa-regular fa-circle-down' />,
      onClick: onDownloadResume,
    },
    {
      label: 'Add to Collection',
      value: 'addToCollection',
      icon: <FontAwesomeIcon icon='fa-regular fa-folder-open' />,
      onClick: onAddToCollection,
    },
  ];

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between mb-2'>
        <p className='text-gray-400 font-light text-[11px]'>{date}</p>
        <DropdownMenu
          options={dropdownOptions}
          trigger={
            <span ref={ellipsisRef}>
              <FontAwesomeIcon
                icon='fa-ellipsis'
                className='rounded-full hover:bg-gray-200 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer p-1'
                title='More actions'
              />
            </span>
          }
          align='right'
          width='w-50'
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
};

export default ResumeHeader;
