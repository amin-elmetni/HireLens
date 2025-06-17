import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleIconButton from '../../ui/ToggleIconButton';
import { useLikes } from '@/hooks/resumes/useLikes';
import { useComments } from '@/hooks/resumes/useComments';
import { useSaves } from '@/hooks/resumes/useSaves';
import { useResumeActions } from '@/hooks/resumes/useResumeActions';
import AddToCollectionDrawer from './AddToCollectionDrawer';
import { useMultiCollectionPicker } from '@/hooks/resumes/useMultiCollectionPicker';
import ConfirmationToast from '@/components/ui/ConfirmationToast';
import ScrollLockOverlay from '@/components/ui/ScrollLockOverlay';

const Actions = ({ uuid }) => {
  const { liked, likeCount, toggleLike } = useLikes(uuid);
  const { commentCount } = useComments(uuid);
  const { saved, toggleSave } = useSaves(uuid);
  const { viewResume, downloadResume } = useResumeActions();

  const collectionPicker = useMultiCollectionPicker(uuid);

  const [toast, setToast] = useState({ show: false, message: '' });

  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (collectionPicker.open) {
      setShowOverlay(true); // Mount the overlay
      setTimeout(() => setFadeIn(true), 10); // Animate in
    } else {
      setFadeIn(false); // Animate out
      const timeout = setTimeout(() => setShowOverlay(false), 200); // Unmount after fade out (duration should match overlay's transition)
      return () => clearTimeout(timeout);
    }
  }, [collectionPicker.open]);

  const handleToggleLike = async () => {
    await toggleLike();
    setToast({
      show: true,
      message: liked ? 'Resume unliked!' : 'Resume liked!',
    });
  };

  // Wrap save handler
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
      onClick: collectionPicker.show,
      regularIcon: 'fa-regular fa-folder',
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
      isActive: false,
    },
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
        <div className='flex items-center gap-2 text-xl'>
          {actionButtons.map((btn, index) => (
            <ToggleIconButton
              key={index}
              {...btn}
            />
          ))}
        </div>
      </div>
      <ScrollLockOverlay
        open={collectionPicker.open}
        onClick={collectionPicker.hide}
        fadeIn={fadeIn}
        lockScroll={false}
      />
      <AddToCollectionDrawer
        open={collectionPicker.open}
        onClose={collectionPicker.hide}
        collections={collectionPicker.collections}
        selectedIds={collectionPicker.selectedIds}
        toggleCollection={collectionPicker.toggleCollection}
        onSearch={collectionPicker.onSearch}
        searchQuery={collectionPicker.searchQuery}
        handleAddAndRemove={collectionPicker.handleAddAndRemove}
        loading={collectionPicker.loading}
        canAdd={collectionPicker.canAdd}
        error={collectionPicker.error}
        setError={collectionPicker.setError}
        onActuallyCreateNew={collectionPicker.onActuallyCreateNew}
        setToast={setToast}
      />
      <ConfirmationToast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </>
  );
};

export default React.memo(Actions);
