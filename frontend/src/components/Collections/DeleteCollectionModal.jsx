import React, { useState, useEffect } from 'react';
import ScrollLockOverlay from '../ui/ScrollLockOverlay';
import PrimaryButton from '../ui/PrimaryButton';
import BackCancelButton from '../ui/BackCancelButton';
import { deleteCollection } from '@/api/collectionApi';

export default function DeleteCollectionModal({ collection, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCollection(collection.id);
      setLoading(false);
      if (onDeleted) onDeleted();
      handleCloseWithFade();
    } catch (err) {
      setLoading(false);
      handleCloseWithFade();
    }
  };

  const handleCloseWithFade = () => {
    setFadeIn(false);
    setTimeout(() => {
      if (onClose) onClose();
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
          <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>Delete Collection?</h3>
          <div className='mb-4 text-base text-gray-700'>
            The individual files within this project will not be deleted.
          </div>
          <div className='flex gap-3 justify-end mt-6'>
            <BackCancelButton
              onClick={handleCloseWithFade}
              text='Cancel'
              disabled={loading}
            />
            <PrimaryButton
              onClick={handleDelete}
              disabled={loading}
              bgcolor='bg-red-600'
              loading={loading}
            >
              Delete
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
