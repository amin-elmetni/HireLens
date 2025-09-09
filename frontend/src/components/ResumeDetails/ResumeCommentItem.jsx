import React from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

export default function ResumeCommentItem({ comment }) {
  const { user, date, comment: text, likes = 0, replies = 0 } = comment;

  return (
    <div className='py-4'>
      <div className='flex items-center gap-3'>
        {/* Avatar */}
        <div className='w-[38px] h-[38px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 font-bold'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='h-full w-full object-cover'
            />
          ) : (
            user.name
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
          )}
        </div>
        {/* Name and date */}
        <div className='flex items-center justify-center gap-2'>
          <span className='font-semibold text-base text-gray-900'>{user.name}</span>
          <span className='text-xs text-gray-500'>{date}</span>
        </div>
      </div>
      {/* Comment text */}
      <div className='ml-12 mt-2'>
        <p className='text-sm text-gray-800'>{text}</p>
        {/* Actions */}
        <div className='flex items-center gap-[10px] mt-2 text-gray-500 text-sm'>
          <button className='flex items-center gap-1 hover:text-primary cursor-pointer'>
            <ThumbsUp size={16} /> {likes}
          </button>
          <button className='flex items-center gap-1 hover:text-primary cursor-pointer'>
            <ThumbsDown size={16} /> {likes}
          </button>
          <button className='flex items-center gap-1 hover:text-primary ml-[10px] cursor-pointer'>
            <MessageCircle size={16} /> Reply
          </button>
        </div>
      </div>
    </div>
  );
}
