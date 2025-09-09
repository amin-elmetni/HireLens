import React, { useState } from 'react';
import { useAuthUser } from '@/hooks/auth/useAuthUser';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { likeComment, dislikeComment } from '@/api/commentApi';
import BackCancelButton from '../ui/BackCancelButton';
import PrimaryButton from '../ui/PrimaryButton';
import { FormattedText } from '../ui/RichTextCommentInput';
import SimpleRichTextEditor from '../ui/SimpleRichTextEditor';

function CommentItem({ comment, onDelete, onUpdate }) {
  // Destructure comment FIRST
  const {
    user,
    userName,
    userId,
    createdAt,
    content,
    id,
    likes = 0,
    dislikes = 0,
    replies = 0,
    userLikeStatus = null, // "liked", "disliked", or null
  } = comment;

  // States for edit/delete actions
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle delete action
  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (typeof onDelete === 'function') {
        await onDelete(id);
      }
    } catch (e) {
      console.error('Delete comment error:', e);
      alert('Failed to delete comment. Please try again.');
    }
    setDeleting(false);
  };

  // Handle update action
  const handleUpdate = async () => {
    if (!editContent.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    setUpdating(true);
    try {
      if (typeof onUpdate === 'function') {
        await onUpdate(id, editContent.trim());
        setEditing(false);
      }
    } catch (e) {
      console.error('Update comment error:', e);
      alert('Failed to update comment. Please try again.');
    }
    setUpdating(false);
  };

  const authUser = useAuthUser();
  // Determine if current user is owner (after destructuring)
  // Convert both to numbers for comparison since they might be strings
  const isOwner =
    authUser &&
    (Number(authUser.id) === Number(user?.id) || Number(authUser.id) === Number(userId));

  // Support both user object and userName/userId fields

  // Fallbacks for user display
  const displayName = user?.name || userName || 'Unknown';
  const avatarUrl = user?.avatar || null;

  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDislike, setLoadingDislike] = useState(false);
  const [userLiked, setUserLiked] = useState(userLikeStatus === 'liked');
  const [userDisliked, setUserDisliked] = useState(userLikeStatus === 'disliked');

  const handleLike = async () => {
    if (!authUser?.id) return;

    setLoadingLike(true);
    try {
      const { data } = await likeComment(id, authUser.id);
      setLikeCount(data.likes);
      setDislikeCount(data.dislikes);
      setUserLiked(data.userLikeStatus === 'liked');
      setUserDisliked(data.userLikeStatus === 'disliked');
    } catch (e) {
      console.error(e);
    }
    setLoadingLike(false);
  };

  const handleDislike = async () => {
    if (!authUser?.id) return;

    setLoadingDislike(true);
    try {
      const { data } = await dislikeComment(id, authUser.id);
      setLikeCount(data.likes);
      setDislikeCount(data.dislikes);
      setUserLiked(data.userLikeStatus === 'liked');
      setUserDisliked(data.userLikeStatus === 'disliked');
    } catch (e) {
      console.error(e);
    }
    setLoadingDislike(false);
  };

  return (
    <div>
      <div className='flex items-center gap-3'>
        {/* Avatar */}
        <div className='w-[38px] h-[38px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 font-bold'>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className='h-full w-full object-cover'
            />
          ) : (
            displayName
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
          )}
        </div>
        {/* Name and date */}
        <div className='flex items-center justify-center gap-2'>
          <span className='font-semibold text-base text-gray-900'>{displayName}</span>
          <span className='text-xs text-gray-500'>
            {createdAt
              ? new Date(createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : ''}
          </span>
        </div>
      </div>
      {/* Comment text */}
      <div className='ml-12 mt-2'>
        {editing ? (
          <div className='flex flex-col gap-2'>
            <SimpleRichTextEditor
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              disabled={updating}
              className='py-1 px-3 outline-none w-full rounded border border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-primary hover:border-primary  transition-colors resize-none scrollbar-custom-2'
              rows={2}
            />
            <div className='flex gap-2 self-end'>
              <PrimaryButton
                className='text-sm flex items-center justify-center h-8 hover:bg-primary/85 hover:shadow-none'
                onClick={handleUpdate}
                disabled={updating}
              >
                Save
              </PrimaryButton>
              <BackCancelButton
                className='text-sm flex items-center justify-center h-8 bg-gray-200'
                onClick={() => setEditing(false)}
                disabled={updating}
                text='Cancel'
              />
            </div>
          </div>
        ) : (
          <div className='text-sm text-gray-800'>
            <FormattedText text={content} />
          </div>
        )}
        {/* Actions */}
        <div
          className={`flex items-center gap-[10px] mt-2 text-gray-500 text-sm ${
            editing ? 'opacity-50 pointer-events-none -translate-y-10' : ''
          }`}
        >
          <button
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              userLiked ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={handleLike}
            disabled={loadingLike}
          >
            <ThumbsUp
              size={16}
              fill={userLiked ? 'currentColor' : 'none'}
            />{' '}
            {likeCount}
          </button>
          <button
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              userDisliked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
            }`}
            onClick={handleDislike}
            disabled={loadingDislike}
          >
            <ThumbsDown
              size={16}
              fill={userDisliked ? 'currentColor' : 'none'}
            />{' '}
            {dislikeCount}
          </button>
          {/* <button className='flex items-center gap-1 hover:text-primary ml-[10px] cursor-pointer'>
            <MessageCircle size={16} /> Reply
          </button> */}
          {isOwner && !editing && (
            <DropdownMenu
              align='right'
              width='w-32'
              trigger={
                <button className='ml-2 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer'>
                  <MoreHorizontal size={20} />
                </button>
              }
              options={[
                {
                  value: 'edit',
                  label: 'Modify',
                  icon: (
                    <span className='text-primary'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 20h9' />
                        <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z' />
                      </svg>
                    </span>
                  ),
                  onClick: () => setEditing(true),
                },
                {
                  value: 'delete',
                  label: deleting ? 'Deleting...' : 'Delete',
                  icon: (
                    <span className='text-red-500'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <polyline points='3 6 5 6 21 6' />
                        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2' />
                      </svg>
                    </span>
                  ),
                  destructive: true,
                  onClick: handleDelete,
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
