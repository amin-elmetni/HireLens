import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreProfileBtn = ({ uuid }) => {
  const navigate = useNavigate();
  return (
    <div className='mb-2'>
      <button
        className='
      w-full py-2 bg-gradient-to-r from-blue-50 to-gray-50
      border border-primary/10 rounded-lg
      text-sm text-primary font-medium
      hover:from-primary/10 hover:to-primary/5 hover:border-primary/20
      hover:text-primary
      transition-all duration-200
      flex items-center justify-center gap-2 cursor-pointer
      group
    '
        onClick={() => navigate(`/resumedetails/${uuid}`)}
      >
        <span>Explore Full Profile</span>
        <FontAwesomeIcon
          icon='chevron-right'
          className='ml-1 group-hover:translate-x-1 transition-transform duration-200'
        />
      </button>
    </div>
  );
};

export default ExploreProfileBtn;
