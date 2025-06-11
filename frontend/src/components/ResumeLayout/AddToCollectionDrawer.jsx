import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  onActuallyCreateNew, // unchanged, for creating new collections
  setToast, // <-- now comes from parent
}) => {
  const [showDrawer, setShowDrawer] = useState(open);
  const [inCreateMode, setInCreateMode] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const inputRef = useRef();
  const newCollectionInputRef = useRef();
  const newCollectionDescriptionRef = useRef();

  // Animate slide in/out
  useEffect(() => {
    if (open) setShowDrawer(true);
    else {
      const timeout = setTimeout(() => setShowDrawer(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  // Focus correct input
  useEffect(() => {
    if (open && !inCreateMode && inputRef.current) inputRef.current.focus();
    if (open && inCreateMode && newCollectionInputRef.current)
      newCollectionInputRef.current.focus();
  }, [open, inCreateMode]);

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
      if (setToast) setToast({ show: true, message: 'Collection Created Successfully!' });
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
      setToast({ show: true, message: 'Resume Collections Updated!' });
    }
    onClose();
  };

  if (!showDrawer && !open) return null;

  return createPortal(
    <>
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[${DRAWER_WIDTH}px] max-w-full bg-white text-gray-900 z-[1010] shadow-lg flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
        style={{
          width: '100%',
          maxWidth: `${DRAWER_WIDTH}px`,
          transform: open ? 'translateX(0)' : `translateX(${DRAWER_WIDTH}px)`,
        }}
        aria-label='Add to Collection Drawer'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-200 flex items-center gap-4'>
          <button
            onClick={handleDrawerClose}
            className='text-gray-900 hover:bg-gray-100 w-12 h-12 rounded-full transition-colors cursor-pointer'
            aria-label='Close'
          >
            <FontAwesomeIcon
              icon='fa-solid fa-arrow-left'
              size='lg'
            />
          </button>
          <span className='text-lg font-semibold'>Add to Collection</span>
        </div>
        {/* Content */}
        <div className='p-6 flex-1 flex flex-col overflow-y-auto'>
          {error && <div className='text-red-600 mb-4 font-medium transition-all'>{error}</div>}
          {inCreateMode ? (
            <div>
              <button
                className='text-gray-900 px-4 py-[6px] hover:bg-gray-100 rounded-full font-semibold transition-colors cursor-pointer mb-1 flex items-center gap-3'
                onClick={handleBackFromCreate}
              >
                <FontAwesomeIcon icon='fa-solid fa-arrow-left' />
                Back
              </button>
              <div className='relative group mb-2'>
                <span
                  className='
                  flex translate-y-[9px] translate-x-3 bg-white w-fit px-2
                  font-semibold uppercase text-[11px] text-gray-400 tracking-wide
                  group-focus-within:text-black group-hover:text-black transition-colors duration-200
                '
                >
                  Collection Name
                </span>
                <input
                  ref={newCollectionInputRef}
                  type='text'
                  className='
                  w-full px-4 py-3 rounded border border-gray-300 bg-transparent text-gray-900
                  focus:outline-none focus:border-black hover:border-black transition-colors text-lg 
                '
                  placeholder='Name your new collection'
                  value={newCollectionName || ''}
                  onChange={handleInputChange}
                  maxLength={50}
                />
              </div>
              {/* Description Field */}
              <div className='relative group mb-6'>
                <span
                  className='
                  flex translate-y-[9px] translate-x-3 bg-white w-fit px-2
                  font-semibold uppercase text-[11px] text-gray-400 tracking-wide
                  group-focus-within:text-black group-hover:text-black transition-colors duration-200
                '
                >
                  Description
                </span>
                <textarea
                  ref={newCollectionDescriptionRef}
                  type='text'
                  className='
                  w-full px-4 py-3 rounded border border-gray-300 bg-transparent text-gray-900
                  focus:outline-none focus:border-black hover:border-black transition-colors text-lg h-40 resize-none scrollbar-custom-2
                '
                  placeholder='Describe your new collection'
                  value={newCollectionDescription || ''}
                  onChange={handleDescriptionChange}
                  maxLength={150}
                />
              </div>
              <div className='flex items-center justify-end'>
                <button
                  className={`px-6 py-[10px] rounded-full font-semibold
                  ${
                    newCollectionName.trim()
                      ? 'bg-primary text-white cursor-pointer hover:shadow-lg transition'
                      : 'bg-gray-400 text-white'
                  }`}
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim() || loading}
                >
                  Create collection
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className='mb-4'>
                <div className='flex items-center pl-6 rounded-full text-gray-900 border border-gray-200 focus-within:border-black hover:border-black transition-colors'>
                  <FontAwesomeIcon
                    icon='fa-solid fa-magnifying-glass'
                    className='text-gray-900'
                  />
                  <input
                    ref={inputRef}
                    type='text'
                    className='w-full pl-4 pr-6 py-3 bg-transparent focus:outline-none'
                    placeholder='Search Collections'
                    value={searchQuery}
                    onChange={e => onSearch(e.target.value)}
                  />
                </div>
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
                        className="form-checkbox appearance-none mr-3 h-[17px] w-[17px] border-2 border-gray-400 rounded-xs 
                 checked:bg-black checked:border-black 
                 relative after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1 
                 after:w-[10px] after:h-[6px] after:border-l-2 after:border-b-2 after:border-white 
                 after:rotate-[-45deg] after:opacity-0 checked:after:opacity-100"
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
          <button
            className='text-black px-6 py-[6px] hover:bg-gray-100 rounded-full font-semibold transition-colors cursor-pointer'
            onClick={handleDrawerClose}
          >
            Cancel
          </button>
          {!inCreateMode && (
            <button
              className={`px-6 py-[6px] rounded-full font-semibold ${
                canAdd
                  ? 'bg-primary text-white hover:shadow-lg cursor-pointer transition'
                  : 'bg-gray-400 text-white'
              }`}
              onClick={handleUpdate}
              disabled={loading}
            >
              Update
            </button>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
};

export default AddToCollectionDrawer;
