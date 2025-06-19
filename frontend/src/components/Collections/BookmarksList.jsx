import React, { useState, useMemo } from 'react';
import useUserBookmarkedResumes from '@/hooks/resumes/useUserBookmarkedResumes';
import ResumeItem from '@/components/Collections/ResumeItem';
import ConfirmationToast from '@/components/ui/ConfirmationToast';
import SearchInput from '@/components/ui/SearchInput';
import SortDropdown from '@/components/ui/SortDropdown';
import AddToCollectionDrawer from '@/components/Resumes/ResumesLayout/AddToCollectionDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUserCollections from '@/hooks/collections/useUserCollections';
import { addItemToCollection, getItemsByCollection } from '@/api/collectionItemApi'; // Added import here
import { getUser } from '@/utils/userUtils';

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

export default function BookmarksList() {
  const { resumes, loading, refresh } = useUserBookmarkedResumes();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('lastUpdated');
  const [selected, setSelected] = useState([]);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [drawerCollections, setDrawerCollections] = useState([]);
  const [drawerSelectedIds, setDrawerSelectedIds] = useState(new Set());
  const [drawerError, setDrawerError] = useState('');
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', id: 0 });

  // User/Collections for drawer
  const user = getUser();
  const { collections: userCollections, refreshCollections } = useUserCollections(user?.id);

  // Filtering & Sorting
  const filteredSortedResumes = useMemo(() => {
    let filtered = resumes.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));
    let sorted = [...filtered];
    if (sort === 'name') {
      sorted.sort((a, b) => getResumeSortValue(a, sort).localeCompare(getResumeSortValue(b, sort)));
    } else {
      sorted.sort((a, b) => getResumeSortValue(b, sort) - getResumeSortValue(a, sort));
    }
    return sorted;
  }, [resumes, search, sort]);

  // Checkbox logic
  const allChecked =
    filteredSortedResumes.length > 0 && selected.length === filteredSortedResumes.length;
  const handleSelectAll = () =>
    setSelected(allChecked ? [] : filteredSortedResumes.map(r => r.uuid));
  const handleToggle = uuid =>
    setSelected(prev => (prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]));

  // Bulk add to collection
  const handleBulkAddToCollection = () => {
    setDrawerCollections(userCollections || []);
    setDrawerSelectedIds(new Set());
    setDrawerError('');
    setShowAddDrawer(true);
  };

  const handleBulkAddAndRemove = async () => {
    setDrawerLoading(true);
    try {
      const resumesToAdd = filteredSortedResumes.filter(r => selected.includes(r.uuid));

      if (resumesToAdd.length === 0 || drawerSelectedIds.size === 0) {
        setDrawerError('Please select at least one resume and one collection');
        setDrawerLoading(false);
        return false;
      }

      // fetch items for each collection first, to check for existing resumeIds
      const collectionItems = {};
      await Promise.all(
        Array.from(drawerSelectedIds).map(async collectionId => {
          try {
            const { data } = await getItemsByCollection(collectionId);
            collectionItems[collectionId] = new Set(data.map(item => item.resumeId));
          } catch (error) {
            console.error(`Failed to get items for collection ${collectionId}:`, error);
            collectionItems[collectionId] = new Set(); // Empty set as fallback
          }
        })
      );

      // Track how many were actually added (excluding duplicates)
      let addedCount = 0;

      // Only add if not already present
      await Promise.all(
        Array.from(drawerSelectedIds).flatMap(collectionId =>
          resumesToAdd
            .filter(resume => {
              // Skip if already in the collection
              const alreadyInCollection = collectionItems[collectionId].has(resume.resumeId);
              if (!alreadyInCollection) addedCount++;
              return !alreadyInCollection;
            })
            .map(resume =>
              addItemToCollection({ collectionId, resumeId: resume.resumeId }).catch(err => {
                console.error(
                  `Failed to add resume ${resume.resumeId} to collection ${collectionId}:`,
                  err
                );
                if (err.response?.status !== 409) throw err;
              })
            )
        )
      );

      setDrawerLoading(false);

      // Show an appropriate message based on how many were actually added
      if (addedCount > 0) {
        setToast({
          show: true,
          message: `Added ${resumesToAdd.length} resume${resumesToAdd.length > 1 ? 's' : ''} to ${
            drawerSelectedIds.size
          } collection${drawerSelectedIds.size > 1 ? 's' : ''}!`,
          id: Date.now(), // Using timestamp as id to ensure uniqueness
        });
      } else {
        setToast({
          show: true,
          message: `All selected resumes were already in the chosen collections.`,
          id: Date.now(),
        });
      }

      setShowAddDrawer(false);
      setSelected([]);
      return true;
    } catch (err) {
      console.error('Error in handleBulkAddAndRemove:', err);
      setDrawerError('Failed to add to collection(s). Please try again.');
      setDrawerLoading(false);
      return false;
    }
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

  // Toast helpers
  const showToast = message => setToast(prev => ({ show: true, message, id: prev.id + 1 }));
  const handleToastClose = () => setToast(prev => ({ ...prev, show: false, message: '' }));

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 flex items-center gap-4'>
        <FontAwesomeIcon icon='fa-regular fa-bookmark' />
        Bookmarked Resumes ({resumes.length})
      </h2>
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
            className='h-10 w-10 rounded-full hover:bg-gray-200 disabled:cursor-default disabled:bg-transparent disabled:text-gray-300 text-xl text-black cursor-pointer'
            title='Add selected resumes to collection'
            onClick={handleBulkAddToCollection}
            disabled={selected.length === 0}
          >
            <FontAwesomeIcon icon='fa-regular fa-folder-open' />
          </button>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : filteredSortedResumes.length === 0 ? (
        <div className='text-gray-400'>No bookmarked resumes found.</div>
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
              mode='bookmarks'
              onShowToast={showToast}
              onRefresh={refresh}
            />
          ))}
        </ul>
      )}
      <AddToCollectionDrawer
        open={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        collections={drawerCollections}
        selectedIds={drawerSelectedIds}
        toggleCollection={collectionId => {
          setDrawerSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(collectionId)) next.delete(collectionId);
            else next.add(collectionId);
            return next;
          });
        }}
        onSearch={() => {}} // implement if you want collection search
        searchQuery=''
        loading={drawerLoading}
        canAdd={drawerSelectedIds.size > 0}
        handleAddAndRemove={handleBulkAddAndRemove}
        error={drawerError}
        setError={setDrawerError}
        onActuallyCreateNew={refreshCollections}
        setToast={showToast}
        resumesToAdd={filteredSortedResumes.filter(r => selected.includes(r.uuid))}
      />
      <ConfirmationToast
        key={toast.id}
        message={toast.message}
        show={toast.show}
        onClose={handleToastClose}
      />
    </div>
  );
}
