import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DRAWER_WIDTH = 550;

const AddToCollectionDrawer = ({
  open,
  onClose,
  collections,
  selected,
  onSelect,
  onSearch,
  searchQuery,
  onCreateNew,
  onAdd,
  loading,
  canAdd,
  onActuallyCreateNew, // will be passed from hook for api call
}) => {
  const [showDrawer, setShowDrawer] = useState(open);
  const [inCreateMode, setInCreateMode] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const inputRef = useRef();
  const newCollectionInputRef = useRef();

  // Animate slide in/out
  useEffect(() => {
    if (open) setShowDrawer(true);
    else {
      // Wait for transition before removing from DOM
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

  // Handler for opening create new collection view
  const handleCreateNewClick = () => {
    setInCreateMode(true);
    setNewCollectionName('');
  };

  // Handler for leaving create new collection view
  const handleBackFromCreate = () => {
    setInCreateMode(false);
    setNewCollectionName('');
  };

  // Handler for actual creation
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    await onActuallyCreateNew(newCollectionName.trim());
    setInCreateMode(false);
    setNewCollectionName('');
  };

  const handleDrawerClose = () => {
    setInCreateMode(false);
    setNewCollectionName('');
    onClose();
  };

  if (!showDrawer && !open) return null;

  return createPortal(
    <aside
      className={`fixed top-0 right-0 h-full w-full sm:w-[${DRAWER_WIDTH}px] max-w-full bg-gray-900 text-white z-[1010] shadow-lg flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
      style={{
        width: '100%',
        maxWidth: `${DRAWER_WIDTH}px`,
        transform: open ? 'translateX(0)' : `translateX(${DRAWER_WIDTH}px)`,
      }}
      aria-label='Add to Collection Drawer'
      onClick={e => e.stopPropagation()} // prevent overlay click
    >
      {/* Header */}
      <div className='px-6 py-5 border-b border-gray-800 flex items-center gap-4'>
        {/* Arrow/back button */}
        {inCreateMode ? (
          <button
            onClick={handleBackFromCreate}
            className='text-white hover:bg-gray-600 w-12 h-12 rounded-full transition-colors cursor-pointer'
            aria-label='Back'
          >
            <FontAwesomeIcon
              icon='fa-solid fa-arrow-left'
              size='lg'
            />
          </button>
        ) : (
          <button
            onClick={handleDrawerClose}
            className='text-white hover:bg-gray-600 w-12 h-12 rounded-full transition-colors cursor-pointer'
            aria-label='Close'
          >
            <FontAwesomeIcon
              icon='fa-solid fa-arrow-left'
              size='lg'
            />
          </button>
        )}
        <span className='text-lg font-semibold'>Add to Collection</span>
      </div>
      {/* Content */}
      <div className='p-6 flex-1 flex flex-col overflow-y-auto'>
        {inCreateMode ? (
          <div>
            <div className='mb-8 flex items-center gap-2'>
              <span className='font-semibold uppercase text-xs text-gray-400 tracking-wide'>
                Collection Name
              </span>
            </div>
            <input
              ref={newCollectionInputRef}
              type='text'
              className='w-full px-4 py-3 rounded border border-gray-400 bg-transparent text-white focus:outline-none focus:border-white transition-colors text-lg mb-8'
              placeholder='Name your new Collection'
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
              maxLength={50}
            />
            <div className='flex items-center justify-end'>
              <button
                className={`px-6 py-[10px] rounded-full font-semibold transition
                  ${
                    newCollectionName.trim()
                      ? 'bg-white text-gray-900 hover:bg-primary hover:text-white cursor-pointer'
                      : 'bg-gray-500 text-gray-900 cursor-not-allowed'
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
              <div className='flex items-center pl-6 rounded-full text-white border border-gray-400 focus-within:border-white transition-colors'>
                <FontAwesomeIcon
                  icon='fa-solid fa-magnifying-glass'
                  className='text-white'
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
              className='flex items-center gap-4 w-full py-4 px-4 bg-transparent rounded text-left hover:bg-gray-800 mb-2 cursor-pointer'
              onClick={handleCreateNewClick}
            >
              <FontAwesomeIcon
                icon='fa-solid fa-plus'
                className='text-lg'
              />
              <span>Create New Collection</span>
            </button>
            <ul className='flex-1 overflow-y-auto'>
              {collections.map(col => (
                <li key={col.id}>
                  <label className='flex items-center py-2 px-0 cursor-pointer hover:bg-gray-800 rounded'>
                    <input
                      type='checkbox'
                      checked={selected && selected.id === col.id}
                      onChange={() => onSelect(col)}
                      className='form-checkbox accent-primary mr-3'
                    />
                    <span>{col.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {/* Footer */}
      <div className='flex items-center justify-end border-t border-gray-800 px-6 py-4 gap-3'>
        <button
          className='text-white px-6 py-[6px] hover:bg-gray-700 rounded-full font-semibold transition-colors cursor-pointer'
          onClick={handleDrawerClose}
        >
          Cancel
        </button>
        {!inCreateMode && (
          <button
            className={`px-6 py-[6px] rounded-full font-semibold transition ${
              canAdd
                ? 'bg-white text-gray-900 hover:bg-primary-dark cursor-pointer'
                : 'bg-gray-500 text-gray-900'
            }`}
            onClick={onAdd}
            disabled={!canAdd || loading}
          >
            Add
          </button>
        )}
      </div>
    </aside>,
    document.body
  );
};

export default AddToCollectionDrawer;
