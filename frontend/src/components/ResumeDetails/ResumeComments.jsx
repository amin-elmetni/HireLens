import React, { useState } from 'react';
import ResumeCommentItem from './ResumeCommentItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ResumeComments({ comments, onAddComment }) {
  const [commentList, setCommentList] = useState(comments);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState('recent');

  // Update when external comments change (after post)
  React.useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    const ok = await onAddComment?.(newComment.trim());
    setSubmitting(false);
    if (ok) setNewComment('');
  };

  return (
    <div>
      {/* Comment Input Box */}
      <div className='bg-gray-100 rounded-xl p-4 mb-8 shadow-sm'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-1'
        >
          <textarea
            className='w-full border-none h-16 bg-transparent resize-none text-base p-0 focus:outline-none'
            placeholder='Add comment...'
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={submitting}
            rows={2}
          />
          <div className='flex items-center justify-between'>
            <div className='flex gap-1 text-gray-500'>
              <button
                type='button'
                title='Bold'
                className='rounded-full hover:bg-gray-200 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer w-8 h-8'
              >
                <FontAwesomeIcon icon='fa-solid fa-bold' />
              </button>
              <button
                type='button'
                title='Italic'
                className='rounded-full hover:bg-gray-200 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer w-8 h-8'
              >
                <FontAwesomeIcon icon='fa-solid fa-italic' />
              </button>
              <button
                type='button'
                title='Underline'
                className='rounded-full hover:bg-gray-200 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer w-8 h-8'
              >
                <FontAwesomeIcon icon='fa-solid fa-underline' />
              </button>
              <button
                type='button'
                title='Emoji'
                className='rounded-full hover:bg-gray-200 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer w-8 h-8'
              >
                <FontAwesomeIcon
                  icon='fa-regular fa-face-smile'
                  className='text-lg'
                />
              </button>
            </div>
            <button
              className='bg-primary hover:bg-primary/85 text-white font-semibold rounded-full px-6 py-2 transition cursor-pointer'
              type='submit'
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments Header */}
      <div className='flex items-center justify-between mb-4 pt-10 border-t border-gray-200'>
        <h2 className='font-bold text-xl flex items-center gap-2 text-gray-800'>
          Comments
          <span className='bg-primary text-white rounded-full w-8 h-6 text-sm font-semibold flex items-center justify-center'>
            {commentList.length}
          </span>
        </h2>
      </div>

      {/* Comments List */}
      <div className='flex flex-col gap-3'>
        {commentList.length > 0 ? (
          commentList.map(c => (
            <ResumeCommentItem
              key={c.id}
              comment={c}
            />
          ))
        ) : (
          <div className='text-gray-400'>No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
}
