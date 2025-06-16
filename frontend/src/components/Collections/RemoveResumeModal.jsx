import React, { useEffect, useState } from 'react';
import ScrollLockOverlay from '@/components/ui/ScrollLockOverlay';
import PrimaryButton from '@/components/ui/PrimaryButton';
import BackCancelButton from '@/components/ui/BackCancelButton';

export default function RemoveResumeModal({ onClose, onConfirm, bulk = false, count = 0 }) {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm?.();
    setLoading(false);
  };

  const handleCloseWithFade = () => {
    setFadeIn(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  return (
    <>
      <ScrollLockOverlay
        open
        fadeIn={fadeIn}
        onClick={handleCloseWithFade}
      />
      <div className='fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none'>
        <div
          className={`
            bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl pointer-events-auto
            transition-opacity duration-200
            ${fadeIn ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>
            {bulk
              ? `Remove ${count} Resume${count !== 1 ? 's' : ''} from Collection?`
              : 'Remove Resume from Collection?'}
          </h3>
          <div className='mb-4 text-base text-gray-700'>
            {bulk
              ? `Are you sure you want to remove ${count} resume${
                  count !== 1 ? 's' : ''
                } from this collection?`
              : 'Are you sure you want to remove this resume from the collection?'}
          </div>
          <div className='flex gap-3 justify-end mt-6'>
            <BackCancelButton
              onClick={handleCloseWithFade}
              text='Cancel'
              disabled={loading}
            />
            <PrimaryButton
              onClick={handleConfirm}
              bgcolor='bg-red-600'
              loading={loading}
              disabled={loading}
            >
              Remove
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
