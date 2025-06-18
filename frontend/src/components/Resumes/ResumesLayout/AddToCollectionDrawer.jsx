import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextInput from '@/components/ui/TextInput';
import TextareaInput from '@/components/ui/TextareaInput';
import SearchInput from '@/components/ui/SearchInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import BackCancelButton from '@/components/ui/BackCancelButton';

const DRAWER_WIDTH = 550;

const AddToCollectionDrawer = ({
  open,
  onClose,
  collections,
  selectedIds,
  toggleCollection,
  onSearch,
  searchQuery,
  loading,
  canAdd,
  handleAddAndRemove,
  error,
  setError,
  onActuallyCreateNew,
  setToast,
  resumesToAdd = [], // Array of resumes to add (single or bulk)
}) => {
  const [showDrawer, setShowDrawer] = useState(open);
  const [inCreateMode, setInCreateMode] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [animateOpen, setAnimateOpen] = useState(false);

  const inputRef = useRef();
  const newCollectionInputRef = useRef();
  const newCollectionDescriptionRef = useRef();

  useEffect(() => {
    let timeout;
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '14px';
    } else {
      timeout = setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setShowDrawer(true);
      setTimeout(() => setAnimateOpen(true), 10);
    } else {
      setAnimateOpen(false);
      const timeout = setTimeout(() => setShowDrawer(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (open && !inCreateMode && inputRef.current) inputRef.current.focus();
    if (open && inCreateMode && newCollectionInputRef.current)
      newCollectionInputRef.current.focus();
  }, [open, inCreateMode]);

  // Handlers
  const handleCreateNewClick = () => {
    setInCreateMode(true);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setError('');
  };

  const handleBackFromCreate = () => {
    setInCreateMode(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setError('');
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    const success = await onActuallyCreateNew?.(
      newCollectionName.trim(),
      newCollectionDescription.trim()
    );
    if (success) {
      setInCreateMode(false);
      setNewCollectionName('');
      setNewCollectionDescription('');
      if (setToast) {
        setToast({
          show: true,
          message: 'Collection Created Successfully!',
        });
      }
    }
  };

  const handleDrawerClose = () => {
    setInCreateMode(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setError('');
    onClose();
  };

  const handleInputChange = e => {
    setNewCollectionName(e.target.value);
    if (error) setError('');
  };

  const handleDescriptionChange = e => {
    setNewCollectionDescription(e.target.value);
    if (error) setError('');
  };

  const handleUpdate = async () => {
    const result = await handleAddAndRemove();
    if (result && setToast) {
      setToast({
        show: true,
        message: 'Collections Updated Successfully!',
      });
    }
    onClose();
  };

  if (!showDrawer && !open) return null;

  return createPortal(
    <>
      {showDrawer && (
        <div
          className={`fixed inset-0 z-[1009] bg-black/20 transition-opacity duration-300 ${
            animateOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleDrawerClose}
        />
      )}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[${DRAWER_WIDTH}px] max-w-full bg-white text-gray-900 z-[1010] shadow-lg flex flex-col
          transition-transform duration-500 ease-in-out
          ${animateOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          width: '100%',
          maxWidth: `${DRAWER_WIDTH}px`,
        }}
        aria-label='Add to Collection Drawer'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-200 flex items-center gap-4'>
          <BackCancelButton
            onClick={handleDrawerClose}
            icon='fa-solid fa-arrow-left'
            size='lg'
            ariaLabel='Close'
          />
          <span className='text-lg font-semibold'>Add to Collection</span>
        </div>
        {/* Content */}
        <div className='p-6 flex-1 flex flex-col overflow-y-auto'>
          {error && <div className='text-red-600 mb-4 font-medium transition-all'>{error}</div>}
          {/* Show selected resumes to add if multiple */}
          {/* {resumesToAdd && resumesToAdd.length > 1 && (
            <div className='mb-4'>
              <span className='text-sm text-gray-500 font-semibold'>Resumes to add:</span>
              <ul className='list-disc list-inside mt-1 text-sm text-gray-700'>
                {resumesToAdd.map(r => (
                  <li key={r.uuid}>{r.name}</li>
                ))}
              </ul>
            </div>
          )} */}
          {inCreateMode ? (
            <div>
              <BackCancelButton
                onClick={handleBackFromCreate}
                icon='fa-solid fa-arrow-left'
                text='Back'
                className='mb-1'
              />
              <TextInput
                ref={newCollectionInputRef}
                label='Collection Name'
                placeholder='Name your new collection'
                value={newCollectionName}
                onChange={handleInputChange}
                maxLength={50}
              />
              <TextareaInput
                ref={newCollectionDescriptionRef}
                label='Description'
                placeholder='Describe your new collection'
                value={newCollectionDescription}
                onChange={handleDescriptionChange}
                maxLength={150}
              />
              <div className='flex items-center justify-end'>
                <PrimaryButton
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim() || loading}
                >
                  Create collection
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <>
              <div className='mb-4'>
                <SearchInput
                  ref={inputRef}
                  value={searchQuery}
                  onChange={e => onSearch(e.target.value)}
                  placeholder='Search Collections'
                />
              </div>
              <button
                className='flex items-center gap-4 w-full py-[14px] px-4 bg-transparent rounded-xs text-left hover:bg-gray-200 cursor-pointer'
                onClick={handleCreateNewClick}
              >
                <FontAwesomeIcon
                  icon='fa-solid fa-plus'
                  className='text-lg'
                />
                <span>Create New Collection</span>
              </button>
              <ul className='flex-1 overflow-y-auto scrollbar-custom-2'>
                {collections.map(col => (
                  <li key={col.id}>
                    <label className='flex items-center py-[14px] px-4 cursor-pointer hover:bg-gray-200 rounded-xs'>
                      <input
                        type='checkbox'
                        checked={selectedIds.has(col.id)}
                        onChange={() => toggleCollection(col.id)}
                        className="form-checkbox appearance-none mr-3 h-[17px] w-[17px] border-2 border-gray-400 rounded-xs checked:bg-primary checked:border-primary relative after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1 after:w-[12px] after:h-[6px] after:border-l-2 after:border-b-2 after:border-white after:rotate-[-45deg] after:opacity-0 checked:after:opacity-100 cursor-pointer"
                      />
                      <span className='text-gray-800'>{col.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {/* Footer */}
        <div className='flex items-center justify-end border-t border-gray-200 px-6 py-4 gap-3'>
          <BackCancelButton
            onClick={handleDrawerClose}
            text='Cancel'
            className='px-6'
          />
          {!inCreateMode && (
            <PrimaryButton
              onClick={handleUpdate}
              disabled={loading || !canAdd}
            >
              {resumesToAdd?.length > 1 ? 'Add All to Collection' : 'Add to Collection'}
            </PrimaryButton>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
};

export default AddToCollectionDrawer;
