import React, { useState, useMemo } from 'react';
import useUserBookmarkedResumes from '@/hooks/resumes/useUserBookmarkedResumes';
import ResumeItem from '@/components/Collections/ResumeItem';
import ConfirmationToast from '@/components/ui/ConfirmationToast';
import SearchInput from '@/components/ui/SearchInput';
import SortDropdown from '@/components/ui/SortDropdown';
import AddToCollectionDrawer from '@/components/Resumes/ResumesLayout/AddToCollectionDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUserCollections from '@/hooks/collections/useUserCollections';
import { addItemToCollection } from '@/api/collectionItemApi';
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
      // fetch items for each collection first, to check for existing resumeIds
      const collectionItems = {};
      await Promise.all(
        Array.from(drawerSelectedIds).map(async collectionId => {
          const { data } = await getItemsByCollection(collectionId);
          collectionItems[collectionId] = new Set(data.map(item => item.resumeId));
        })
      );
      // Only add if not already present
      await Promise.all(
        Array.from(drawerSelectedIds).flatMap(collectionId =>
          resumesToAdd
            .filter(resume => !collectionItems[collectionId].has(resume.resumeId))
            .map(resume =>
              addItemToCollection({ collectionId, resumeId: resume.resumeId }).catch(err => {
                if (err.response?.status !== 409) throw err;
              })
            )
        )
      );
      setDrawerLoading(false);
      setToast(prev => ({
        show: true,
        message: `Added ${resumesToAdd.length} resume${resumesToAdd.length > 1 ? 's' : ''} to ${
          drawerSelectedIds.size
        } collection${drawerSelectedIds.size > 1 ? 's' : ''}!`,
        id: prev.id + 1,
      }));
      setShowAddDrawer(false);
      setSelected([]);
      return true;
    } catch (err) {
      setDrawerError('Failed to add to collection(s).');
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
      <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <FontAwesomeIcon
          icon='fa-regular fa-bookmark'
          className='text-primary'
        />
        Bookmarked Resumes
      </h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <SearchInput
          placeholder='Search resumes...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
              className="form-checkbox appearance-none mr-3 h-[20px] w-[20px] border-2 border-gray-400 rounded-xs checked:bg-primary checked:border-primary relative after:absolute after:content-[''] after:block"
            />
            <span className='ml-2 text-gray-700 text-sm'>
              {selected.length > 0 ? `${selected.length} selected` : 'Select All'}
            </span>
          </label>
          <button
            className='h-10 w-10 rounded-full hover:bg-blue-100 text-xl text-blue-600 cursor-pointer'
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
