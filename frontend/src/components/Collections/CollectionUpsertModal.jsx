import React, { useState, useRef, useEffect } from 'react';
import ScrollLockOverlay from '../ui/ScrollLockOverlay';
import PrimaryButton from '../ui/PrimaryButton';
import BackCancelButton from '../ui/BackCancelButton';
import TextInput from '../ui/TextInput';
import TextareaInput from '../ui/TextareaInput';
import { createCollection, updateCollection } from '@/api/collectionApi';
import { getUser } from '@/utils/userUtils';

/**
 * Props:
 * - mode: "create" | "edit"
 * - collection?: object (for edit)
 * - onClose: function
 * - onSuccess: function
 */
export default function CollectionUpsertModal({
  mode = 'create',
  collection = {},
  onClose,
  onSuccess,
}) {
  const isEdit = mode === 'edit';
  const user = getUser();

  const [name, setName] = useState(isEdit ? collection.name || '' : '');
  const [description, setDescription] = useState(isEdit ? collection.description || '' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    setFadeIn(true);
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateCollection({
          ...collection,
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        await createCollection({
          name: name.trim(),
          description: description.trim(),
          visibility: 'PRIVATE',
          userId: user.id,
        });
      }
      setLoading(false);
      if (onSuccess) onSuccess();
      handleCloseWithFade();
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 409) {
        setError('Collection name already exists.');
      } else if (err?.response?.data) {
        setError(`An error occurred: ${err.response.data}`);
      } else {
        setError(`An error occurred. Please try again. (${err.message})`);
      }
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
          <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>
            {isEdit ? 'Rename Collection' : 'New Collection'}
          </h3>
          {error && <div className='text-sm text-red-600 mt-2 mb-1 font-semibold'>{error}</div>}
          <TextInput
            ref={nameRef}
            label='Collection Name'
            placeholder='Untitled collection'
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
            placeholder='Describe your collection'
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
              onClick={handleSubmit}
              disabled={!name.trim() || loading}
              loading={loading}
            >
              {isEdit ? 'Rename' : 'Create'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
