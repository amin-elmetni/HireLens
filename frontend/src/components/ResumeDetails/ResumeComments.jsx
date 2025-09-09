import React, { useState } from 'react';
import { useAuthUser } from '@/hooks/auth/useAuthUser';
import ResumeCommentItem from './ResumeCommentItem';
import { deleteComment, updateComment } from '@/api/commentApi';
import { useEffect } from 'react';
import RichTextCommentInput from '../ui/RichTextCommentInput';

export default function ResumeComments({
  comments,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
}) {
  const [commentList, setCommentList] = useState(comments);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState('recent');

  // Update when external comments change (after post)
  useEffect(() => {
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

  // Get current user
  const authUser = useAuthUser();

  // Handle delete and update actions
  const handleDelete = async commentId => {
    if (!authUser?.id) {
      console.error('No user ID for delete');
      return;
    }
    try {
      await onDeleteComment?.(commentId);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleUpdate = async (commentId, newContent) => {
    try {
      // Send newContent as string
      await onUpdateComment?.(commentId, newContent);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      {/* Comment Input Box */}
      <RichTextCommentInput
        value={newComment}
        onChange={setNewComment}
        onSubmit={handleSubmit}
        disabled={submitting}
        placeholder='Add comment...'
      />

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
      <div className='flex flex-col gap-8'>
        {commentList.length > 0 ? (
          commentList.map(c => (
            <ResumeCommentItem
              key={c.id}
              comment={c}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <div className='text-gray-400'>No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
}
