import React from 'react';
import { getInitials } from '@/utils/generalUtils';

const UserAvatar = ({ name, avatar }) => {
  return avatar ? (
    <img
      src={avatar}
      alt='User avatar'
      className='w-11 h-11 rounded-xl object-cover border border-gray-200'
    />
  ) : (
    <div className='w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-semibold'>
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
