import React, { useState, useRef, useEffect } from 'react';
import ScrollLockOverlay from '../ui/ScrollLockOverlay';
import PrimaryButton from '../ui/PrimaryButton';
import BackCancelButton from '../ui/BackCancelButton';
import TextInput from '../ui/TextInput';
import TextareaInput from '../ui/TextareaInput';
import { createCollection } from '@/api/collectionApi';
import { getUser } from '@/utils/userUtils';

export default function CreateCollectionModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const nameRef = useRef(null);
  const user = getUser();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createCollection({
        name: name.trim(),
        description: description.trim(),
        visibility: 'PRIVATE',
        userId: user.id,
      });
      setLoading(false);
      if (onCreated) onCreated();
      handleCloseWithFade();
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 409) {
        setError(
          err?.response?.data ||
            `A collection named "${name}" already exists. Please choose a different name.`
        );
      } else if (err?.response?.data) {
        setError(`An error occurred: ${err.response.data}`);
      } else {
        setError(`An error occurred. Please try again. (${err.message})`);
      }
    }
  };

  // Fade-out before closing
  const handleCloseWithFade = () => {
    setFadeIn(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  // Overlay click closes modal (with fade)
  const handleOverlayClick = () => {
    if (!loading) handleCloseWithFade();
  };

  return (
    <>
      <ScrollLockOverlay
        open
        onClick={handleOverlayClick}
        fadeIn={fadeIn}
      />
      <div
        className={`
          fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none
        `}
      >
        <div
          className={`
            bg-white rounded-3xl shadow-lg p-8 w-full max-w-md pointer-events-auto relative
            transition-opacity duration-200
            ${fadeIn ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>New Collection</h3>
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
            placeholder='Describe your new collection'
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={150}
            disabled={loading}
          />
          {error && <div className='text-sm text-red-600 mt-2 mb-1'>{error}</div>}
          <div className='flex gap-3 justify-end mt-4'>
            <BackCancelButton
              onClick={handleCloseWithFade}
              text='Cancel'
              disabled={loading}
            />
            <PrimaryButton
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              loading={loading}
            >
              Create
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
