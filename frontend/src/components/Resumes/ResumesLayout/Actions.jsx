import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleIconButton from '../../ui/ToggleIconButton';
import { useLikes } from '@/hooks/resumes/useLikes';
import { useComments } from '@/hooks/resumes/useComments';
import { useSaves } from '@/hooks/resumes/useSaves';
import ConfirmationToast from '@/components/ui/ConfirmationToast';

const Actions = ({ uuid }) => {
  const { liked, likeCount, toggleLike } = useLikes(uuid);
  const { commentCount } = useComments(uuid);
  const { saved, toggleSave } = useSaves(uuid);

  const [toast, setToast] = useState({ show: false, message: '' });

  const handleToggleLike = async () => {
    await toggleLike();
    setToast({
      show: true,
      message: liked ? 'Resume unliked!' : 'Resume liked!',
    });
  };

  const handleToggleSave = async () => {
    await toggleSave();
    setToast(prev => ({
      show: true,
      message: saved ? 'Resume unsaved!' : 'Resume saved!',
      id: prev.id + 1,
    }));
  };

  const actionButtons = [
    {
      onClick: handleToggleLike,
      regularIcon: 'fa-regular fa-heart',
      solidIcon: 'fa-solid fa-heart',
      activeColor: 'text-red-500',
      isActive: liked,
    },
    {
      onClick: handleToggleSave,
      regularIcon: 'fa-regular fa-bookmark',
      solidIcon: 'fa-solid fa-bookmark',
      activeColor: 'text-yellow-400',
      isActive: saved,
    },
  ];

  return (
    <>
      <div className='flex items-center justify-between'>
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
        <div className='flex items-center gap-[8px] text-xl translate-x-2'>
          {actionButtons.map((btn, index) => (
            <ToggleIconButton
              key={index}
              {...btn}
            />
          ))}
        </div>
      </div>
      <ConfirmationToast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </>
  );
};

export default React.memo(Actions);
