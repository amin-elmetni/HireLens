import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ExploreProfileBtn = () => {
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
      >
        Explore Full Profile
        <FontAwesomeIcon
          icon='fa-solid fa-angle-right'
          className='text-primary group-hover:translate-x-1 transition-transform duration-200'
        />
      </button>
    </div>
  );
};

export default ExploreProfileBtn;
