import React, { useState, useRef, useEffect } from 'react';
import ScrollLockOverlay from '../ui/ScrollLockOverlay';
import PrimaryButton from '../ui/PrimaryButton';
import BackCancelButton from '../ui/BackCancelButton';
import TextInput from '../ui/TextInput';
import TextareaInput from '../ui/TextareaInput';
import { updateCollection } from '@/api/collectionApi';

export default function RenameCollectionModal({ collection, currentName, onClose, onRenamed }) {
  const [name, setName] = useState(currentName || '');
  const [description, setDescription] = useState(collection.description || '');
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef();

  useEffect(() => {
    setFadeIn(true);
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleRename = async () => {
    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updateCollection({
        ...collection,
        name: name.trim(),
        description: description.trim(),
      });
      setLoading(false);
      if (onRenamed) onRenamed();
      handleCloseWithFade();
    } catch (err) {
      setLoading(false);
      setError('Failed to update collection.');
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
          <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>Rename Collection</h3>
          {error && <div className='text-sm text-red-600 mt-2 mb-1 font-semibold'>{error}</div>}
          <TextInput
            ref={nameRef}
            label='Name'
            placeholder='Collection name'
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (error) setError('');
            }}
            maxLength={50}
            disabled={loading}
          />
          <TextareaInput
            label='Description'
            placeholder='Collection description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={150}
            disabled={loading}
          />
          <div className='flex gap-3 justify-end mt-6'>
            <BackCancelButton
              onClick={handleCloseWithFade}
              text='Cancel'
              disabled={loading}
            />
            <PrimaryButton
              onClick={handleRename}
              disabled={!name.trim() || loading}
              loading={loading}
            >
              Rename
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
