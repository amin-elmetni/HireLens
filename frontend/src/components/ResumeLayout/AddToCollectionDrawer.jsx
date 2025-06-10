import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddToCollectionDrawer = props => {
  const { open, onClose, ...rest } = props;
  const inputRef = useRef();

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;

  const drawer = (
    <aside
      className='fixed top-0 right-0 h-full w-full sm:w-[550px] max-w-full bg-gray-900 text-white z-[1010] shadow-lg flex flex-col transition-transform duration-300'
      style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      aria-label='Add to Collection Drawer'
    >
      <div className='px-6 py-5 border-b border-gray-800 flex items-center gap-4'>
        <button
          onClick={onClose}
          className='text-white hover:bg-gray-600 w-12 h-12 rounded-full transition-colors cursor-pointer'
        >
          <FontAwesomeIcon
            icon='fa-solid fa-arrow-left'
            size='lg'
          />
        </button>
        <span className='text-lg font-semibold'>Add to Collection</span>
      </div>
      <div className='p-6 flex-1 flex flex-col overflow-y-auto'>
        <div className='mb-4'>
          <div className='flex items-center pl-6 rounded-full text-white border border-gray-400 focus-within:border-white transition-colors'>
            <FontAwesomeIcon
              icon='fa-solid fa-magnifying-glass'
              className='text-white'
            />
            <input
              ref={inputRef}
              type='text'
              className='w-full pl-4 pr-6 py-3 focus:outline-none'
              placeholder='Search Collections'
              value={rest.searchQuery}
              onChange={e => rest.onSearch(e.target.value)}
            />
          </div>
        </div>
        <button
          className='flex items-center gap-4 w-full py-4 px-4 bg-transparent rounded text-left hover:bg-gray-800 mb-2 cursor-pointer'
          onClick={rest.onCreateNew}
        >
          <FontAwesomeIcon
            icon='fa-solid fa-plus'
            className='text-lg'
          />
          <span>Create New Collection</span>
        </button>
        <ul className='flex-1 overflow-y-auto'>
          {rest.collections.map(col => (
            <li key={col.id}>
              <label className='flex items-center py-2 px-0 cursor-pointer hover:bg-gray-800 rounded'>
                <input
                  type='checkbox'
                  checked={rest.selected && rest.selected.id === col.id}
                  onChange={() => rest.onSelect(col)}
                  className='form-checkbox accent-primary mr-3'
                />
                <span>{col.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex items-center justify-end border-t border-gray-800 px-6 py-4 gap-3'>
        <button
          className='text-white px-6 py-[6px] hover:bg-gray-700 rounded-full font-semibold transition-colors cursor-pointer'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`px-6 py-[6px] rounded-full font-semibold transition ${
            rest.canAdd
              ? 'bg-white text-gray-900 hover:bg-primary-dark cursor-pointer'
              : 'bg-gray-500 text-gray-900'
          }`}
          onClick={rest.onAdd}
          disabled={!rest.canAdd || rest.loading}
        >
          Add
        </button>
      </div>
    </aside>
  );

  return createPortal(drawer, document.body);
};

export default AddToCollectionDrawer;
