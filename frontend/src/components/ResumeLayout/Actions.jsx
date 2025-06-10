// src/components/Actions.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleIconButton from './ToggleIconButton';
import { useLikes } from '@/hooks/resumes/useLikes';
import { useComments } from '@/hooks/resumes/useComments';
import { useSaves } from '@/hooks/resumes/useSaves';
import { useResumeActions } from '@/hooks/resumes/useResumeActions';

const Actions = ({ uuid }) => {
  const { liked, likeCount, toggleLike } = useLikes(uuid);
  const { commentCount } = useComments(uuid);
  const { saved, toggleSave } = useSaves(uuid);
  const { viewResume, downloadResume } = useResumeActions();

  const actionButtons = [
    {
      // onClick: toggleLike,
      regularIcon: 'fa-solid fa-folder-plus',
      solidIcon: 'fa-regular fa-folder-open',
      activeColor: 'text-blue-500',
      isActive: false,
    },
    {
      onClick: () => viewResume(uuid),
      regularIcon: 'fa-regular fa-eye',
      solidIcon: 'fa-solid fa-eye',
      activeColor: 'text-gray-500',
      isActive: false,
    },
    {
      onClick: () => downloadResume(uuid),
      regularIcon: 'fa-regular fa-circle-down',
      solidIcon: 'fa-solid fa-circle-down',
      activeColor: 'text-green-500',
      activeColor: 'text-green-500',
      isActive: false,
    },
    {
      onClick: toggleLike,
      regularIcon: 'fa-regular fa-heart',
      solidIcon: 'fa-solid fa-heart',
      activeColor: 'text-red-500',
      isActive: liked,
    },
    {
      onClick: toggleSave,
      regularIcon: 'fa-regular fa-bookmark',
      solidIcon: 'fa-solid fa-bookmark',
      activeColor: 'text-yellow-400',
      isActive: saved,
    },
  ];

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm'>
      <div className='flex items-center gap-2 text-sm'>
        <div className='flex items-center gap-1 group cursor-default'>
          <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
          <span>{likeCount}</span>
        </div>
        <div className='flex items-center gap-1 group cursor-default'>
          <FontAwesomeIcon icon='fa-regular fa-comment' />
          <span>{commentCount}</span>
        </div>
      </div>

      <div className='flex items-center gap-2 text-xl'>
        {actionButtons.map((btn, index) => (
          <ToggleIconButton
            key={index}
            {...btn}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Actions);
