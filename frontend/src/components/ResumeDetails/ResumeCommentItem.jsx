import React from 'react';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.299;
  return (
    <div className='flex items-center gap-1 text-[#FFBF00]'>
      {[...Array(full)].map((_, i) => (
        <i
          key={i}
          className='fa-solid fa-star'
        />
      ))}
      {half && <i className='fa-solid fa-star-half-stroke' />}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
        <i
          key={i}
          className='fa-regular fa-star'
        />
      ))}
    </div>
  );
}

export default function ResumeCommentItem({ comment }) {
  const { user, date, comment: text } = comment;
  return (
    <div className='flex flex-col h-[195px] border border-gray-600 p-4 rounded'>
      <div className='flex gap-4'>
        <div className='w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl border border-gray-400'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='h-[50px] w-[50px] object-cover rounded-full'
            />
          ) : (
            user.name
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
          )}
        </div>
        <div className='flex flex-col'>
          <span className='font-medium'>{user.name}</span>
          <div className='flex gap-3 text-sm'>
            {/* <StarRating rating={user.rating} /> */}
            <span className='text-gray-500'>{date}</span>
          </div>
        </div>
      </div>
      <p className='mt-3 px-[5px] overflow-y-auto scrollbar-custom text-[15px]'>{text}</p>
    </div>
  );
}
