import React, { useState } from 'react';
import ResumeCommentItem from './ResumeCommentItem';

export default function ResumeComments({ comments }) {
  const [commentList, setCommentList] = useState(comments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentList([
      ...commentList,
      {
        id: Date.now(),
        user: { name: 'You', avatar: '', rating: 5 },
        date: new Date().toLocaleDateString('en-GB'),
        comment: newComment,
      },
    ]);
    setNewComment('');
  };

  return (
    <div>
      <h2 className='font-bold text-2xl mb-4'>Comments</h2>
      <form
        onSubmit={handleSubmit}
        className='mb-6 flex gap-3'
      >
        <textarea
          className='flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary min-h-[50px] resize-none'
          placeholder='Add a comment...'
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          className='bg-primary text-white font-semibold rounded-lg px-6 py-2 hover:bg-[#0891b2] transition cursor-pointer'
          type='submit'
        >
          Comment
        </button>
      </form>
      <div className='grid md:grid-cols-2 gap-6'>
        {commentList.length > 0 ? (
          commentList.map(c => (
            <ResumeCommentItem
              key={c.id}
              comment={c}
            />
          ))
        ) : (
          <div className='col-span-2 text-gray-400'>No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
}
