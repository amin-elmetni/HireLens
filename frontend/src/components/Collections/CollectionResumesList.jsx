import React, { useState, useMemo } from 'react';
import ResumeItem from './ResumeItem';
import BackCancelButton from '../ui/BackCancelButton';
import useCollectionResumes from '@/hooks/collections/useCollectionResumes';
import { removeItemFromCollection } from '@/api/collectionItemApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RemoveResumeModal from './RemoveResumeModal';
import ConfirmationToast from '@/components/ui/ConfirmationToast';
import SearchInput from '@/components/ui/SearchInput';
import SortDropdown from '@/components/ui/SortDropdown';

// Utility to get sort value
const getResumeSortValue = (resume, sortBy) => {
  if (!resume) return '';
  switch (sortBy) {
    case 'name':
      return resume.name?.toLowerCase() || '';
    case 'lastUpdated':
      return new Date(resume.lastUpdated || 0).getTime();
    case 'yearsOfExperience':
      return resume.yearsOfExperience ?? 0;
    case 'experiencesCount':
      return resume.experiencesCount ?? 0;
    case 'projectsCount':
      return resume.projectsCount ?? 0;
    case 'likes':
      return resume.likes ?? 0;
    case 'comments':
      return resume.comments ?? 0;
    default:
      return '';
  }
};

export default function CollectionResumesList({ collection, onBack }) {
  const { resumes, loading, refresh } = useCollectionResumes(collection?.id);
  const [selected, setSelected] = useState([]);
  const [showBulkRemoveModal, setShowBulkRemoveModal] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', id: 0 });
  const showToast = message => setToast(prev => ({ show: true, message, id: prev.id + 1 }));
  const handleToastClose = () => setToast(prev => ({ ...prev, show: false, message: '' }));

  // Search and Sort state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('lastUpdated');

  // Filtering & Sorting
  const filteredSortedResumes = useMemo(() => {
    let filtered = resumes;
    if (search.trim()) {
      filtered = filtered.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));
    }
    // For string fields (name), sort ascending; for others, descending
    let sorted = [...filtered];
    if (sort === 'name') {
      sorted.sort((a, b) => getResumeSortValue(a, sort).localeCompare(getResumeSortValue(b, sort)));
    } else {
      sorted.sort((a, b) => getResumeSortValue(b, sort) - getResumeSortValue(a, sort));
    }
    return sorted;
  }, [resumes, search, sort]);

  // Toggle single resume selection
  const handleToggle = uuid => {
    setSelected(prev => (prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]));
  };

  // Select all / Deselect all
  const allChecked =
    filteredSortedResumes.length > 0 && selected.length === filteredSortedResumes.length;
  const handleSelectAll = () =>
    setSelected(allChecked ? [] : filteredSortedResumes.map(r => r.uuid));

  // Remove selected resumes from collection
  const handleBulkRemove = async () => {
    setShowBulkRemoveModal(true);
  };

  const confirmBulkRemove = async () => {
    for (const uuid of selected) {
      const resume = filteredSortedResumes.find(r => r.uuid === uuid);
      if (resume && resume.resumeId) {
        await removeItemFromCollection(collection.id, resume.resumeId);
      }
    }
    setSelected([]);
    setShowBulkRemoveModal(false);
    refresh();
    showToast('Resumes removed from collection!');
  };

  // Sorting options
  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Last Updated', value: 'lastUpdated' },
    { label: 'Years of Experience', value: 'yearsOfExperience' },
    { label: 'Number of Experiences', value: 'experiencesCount' },
    { label: 'Number of Projects', value: 'projectsCount' },
    { label: 'Number of Likes', value: 'likes' },
    { label: 'Number of Comments', value: 'comments' },
  ];

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
      {/* Search and Sort */}
      <SearchInput
        placeholder='Search resumes...'
        value={search}
        onChange={e => setSearch(e.target.value)}
        className='w-full'
      />
      <div className='my-4 text-end'>
        <SortDropdown
          options={sortOptions}
          value={sort}
          onChange={setSort}
          showLabels={false}
        />
      </div>
      {/* Select all and Bulk remove */}
      {filteredSortedResumes.length > 0 && (
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
            className='h-10 w-10 rounded-full hover:bg-gray-200 disabled:cursor-default disabled:bg-transparent disabled:text-gray-300 text-xl text-red-600 cursor-pointer'
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
      ) : filteredSortedResumes.length === 0 ? (
        <div className='text-gray-400'>No resumes in this collection.</div>
      ) : (
        <ul className='divide-y divide-gray-200'>
          {filteredSortedResumes.map(r => (
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
              onShowToast={showToast}
            />
          ))}
        </ul>
      )}
      {showBulkRemoveModal && (
        <RemoveResumeModal
          onClose={() => setShowBulkRemoveModal(false)}
          onConfirm={confirmBulkRemove}
          bulk
          count={selected.length}
        />
      )}
      <ConfirmationToast
        key={toast.id}
        message={toast.message}
        show={toast.show}
        onClose={handleToastClose}
      />
    </div>
  );
}
