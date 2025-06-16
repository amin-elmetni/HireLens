import React, { useState, useMemo } from 'react';
import ResumeItem from './ResumeItem';
import BackCancelButton from '../ui/BackCancelButton';
import useCollectionResumes from '@/hooks/collections/useCollectionResumes';
import { removeItemFromCollection } from '@/api/collectionItemApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CollectionResumesList({ collection, onBack }) {
  const { resumes, loading, refresh } = useCollectionResumes(collection?.id);
  const [selected, setSelected] = useState([]);

  // Toggle single resume selection
  const handleToggle = uuid => {
    setSelected(prev => (prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]));
  };

  // Select all / Deselect all
  const allChecked = resumes.length > 0 && selected.length === resumes.length;
  const handleSelectAll = () => setSelected(allChecked ? [] : resumes.map(r => r.uuid));

  // Remove selected resumes from collection
  const handleBulkRemove = async () => {
    for (const uuid of selected) {
      const resume = resumes.find(r => r.uuid === uuid);
      if (resume && resume.resumeId) {
        await removeItemFromCollection(collection.id, resume.resumeId);
      }
    }
    setSelected([]);
    refresh();
  };

  return (
    <div className='-translate-y-4'>
      <BackCancelButton
        onClick={onBack}
        icon='fa-solid fa-arrow-left'
        text='Back to Collections'
        className='mb-6'
        ariaLabel='Close'
      />
      <h2 className='text-2xl text-gray-800 font-bold mb-4'>
        <FontAwesomeIcon
          icon='fa-regular fa-folder'
          className='mr-4'
        />
        {collection.name}
      </h2>
      {/* Select all and Bulk remove */}
      {resumes.length > 0 && (
        <div className='flex items-center justify-between gap-3 mb-2'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={allChecked}
              onChange={handleSelectAll}
              className="form-checkbox appearance-none mr-3 h-[20px] w-[20px] border-2 border-gray-400 rounded-xs checked:bg-primary checked:border-primary relative after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1 after:w-[12px] after:h-[6px] after:border-l-2 after:border-b-2 after:border-white after:rotate-[-45deg] after:opacity-0 checked:after:opacity-100 cursor-pointer"
            />
            <span className='ml-2 text-gray-700 text-sm'>
              {selected.length > 0 ? `${selected.length} selected` : 'Select All'}
            </span>
          </label>
          <button
            className='h-10 w-10 rounded-full hover:bg-gray-200 disabled:cursor-default disabled:bg-transparent disabled:text-gray-300 text-xl text-gray-900 cursor-pointer'
            title='Remove selected items from the collection'
            onClick={handleBulkRemove}
            disabled={selected.length === 0}
          >
            <FontAwesomeIcon icon='fa-regular fa-trash-can' />
          </button>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : resumes.length === 0 ? (
        <div className='text-gray-400'>No resumes in this collection.</div>
      ) : (
        <ul className='divide-y divide-gray-200'>
          {resumes.map(r => (
            <ResumeItem
              key={r.uuid}
              {...r}
              resumeId={r.resumeId}
              checked={selected.includes(r.uuid)}
              onCheck={() => handleToggle(r.uuid)}
              selectionModeActive={selected.length > 0}
              collectionId={collection.id}
              onRemovedSingle={() => {
                setSelected(selected => selected.filter(id => id !== r.uuid));
                refresh();
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
