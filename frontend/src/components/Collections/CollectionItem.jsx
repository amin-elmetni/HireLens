import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CollectionItem({ collection }) {
  return (
    <li className='flex items-center py-4 px-4 hover:bg-gray-50 group cursor-pointer'>
      <span className='mr-4 text-xl'>📁</span>
      <span className='font-semibold text-lg'>{collection.name}</span>
      <span className='text-gray-500 ml-2'>({collection.count || 0})</span>
      <div className='ml-auto'>
        <button className='p-2 rounded-full hover:bg-gray-200 h-8 w-8 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer'>
          <FontAwesomeIcon
            icon='fa-solid fa-ellipsis-vertical'
            className=''
          />
        </button>
      </div>
    </li>
  );
}
