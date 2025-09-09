import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropdownMenu from '../ui/DropdownMenu';
import { useResumeActions } from '@/hooks/resumes/useResumeActions';
import { useSaves } from '@/hooks/resumes/useSaves';
import { removeItemFromCollection } from '@/api/collectionItemApi';
import { formatDate } from '@/utils/generalUtils';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import AddToCollectionDrawer from '@/components/Resumes/ResumesLayout/AddToCollectionDrawer';
import useUserCollections from '@/hooks/collections/useUserCollections';
import { getUser } from '@/utils/userUtils';
import { useMultiCollectionPicker } from '@/hooks/resumes/useMultiCollectionPicker';
import { useNavigate } from 'react-router-dom';

const StatItem = ({ icon, value, label }) => (
  <div className='flex items-center text-gray-600 font-medium'>
    <FontAwesomeIcon
      icon={icon}
      className='text-primary text-xs'
    />
    <span className='ml-1'>{value}</span>
    <span className='ml-[3px]'>{label}</span>
  </div>
);

const ResumeItem = ({
  uuid,
  name,
  topCategory,
  lastUpdated,
  likes,
  comments,
  yearsOfExperience,
  experiencesCount,
  projectsCount,
  checked,
  onCheck,
  selectionModeActive,
  collectionId,
  resumeId,
  onRemovedSingle,
  onShowToast,
  mode = 'collection', // mode: 'collection' | 'bookmarks'
  onRefresh,
  onParentRefreshCollections,
}) => {
  const navigate = useNavigate();
  const { viewResume, downloadResume } = useResumeActions();
  const { saved, toggleSave } = useSaves(uuid);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [showAddToCollection, setShowAddToCollection] = useState(false);

  const collectionPicker = useMultiCollectionPicker(uuid);

  // For AddToCollectionDrawer
  const user = getUser();

  const handleRemove = () => setShowRemoveModal(true);

  const confirmRemove = async () => {
    setRemoveLoading(true);
    await removeItemFromCollection(collectionId, resumeId);
    setRemoveLoading(false);
    setShowRemoveModal(false);
    if (onRemovedSingle) onRemovedSingle();
    if (onShowToast) onShowToast('Resume removed from collection!');
  };

  const handleDownload = () => {
    downloadResume(uuid);
    if (onShowToast) onShowToast('Resume download started!');
  };

  const handleBookmark = async () => {
    await toggleSave();
    if (onShowToast) onShowToast(saved ? 'Bookmark removed!' : 'Resume bookmarked!');
    // Refresh bookmarks if in bookmarks mode
    if (mode === 'bookmarks' && onRefresh) onRefresh();
  };

  // Dropdown options
  const dropdownOptions = [
    {
      label: 'View Resume',
      value: 'view',
      icon: <FontAwesomeIcon icon='fa-regular fa-eye' />,
      onClick: e => {
        e?.stopPropagation?.();
        viewResume(uuid);
      },
    },
    {
      label: 'Download',
      value: 'download',
      icon: <FontAwesomeIcon icon='fa-regular fa-circle-down' />,
      onClick: e => {
        e?.stopPropagation?.();
        handleDownload();
      },
    },
    {
      label: saved ? 'Remove Bookmark' : 'Bookmark',
      value: 'bookmark',
      icon: saved ? (
        <FontAwesomeIcon icon='fa-solid fa-bookmark' />
      ) : (
        <FontAwesomeIcon icon='fa-regular fa-bookmark' />
      ),
      onClick: e => {
        e?.stopPropagation?.();
        handleBookmark();
      },
    },
  ];

  if (mode === 'collection') {
    dropdownOptions.push({
      label: 'Remove From Collection',
      value: 'remove',
      icon: <FontAwesomeIcon icon='fa-regular fa-trash-can' />,
      onClick: e => {
        e?.stopPropagation?.();
        handleRemove();
      },
      destructive: true,
    });
  } else if (mode === 'bookmarks') {
    dropdownOptions.push({
      label: 'Add to Collection',
      value: 'add_to_collection',
      icon: <FontAwesomeIcon icon='fa-regular fa-folder-open' />,
      onClick: e => {
        e?.stopPropagation?.();
        collectionPicker.show();
      },
    });
  }

  return (
    <>
      <li
        className='flex items-center justify-between py-4 gap-3 hover:bg-gray-50 transition-colors cursor-pointer px-8'
        onClick={() => navigate(`/resumedetails/${uuid}`)}
      >
        {/* Custom Checkbox */}
        <div className='flex items-center gap-2 min-w-[30px]'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={checked}
              onChange={onCheck}
              className="form-checkbox appearance-none mr-3 h-[20px] w-[20px] border-2 border-gray-400 rounded-xs checked:bg-primary checked:border-primary relative after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1 after:w-[12px] after:h-[6px] after:border-l-2 after:border-b-2 after:border-white after:rotate-[-45deg] after:opacity-0 checked:after:opacity-100 cursor-pointer"
            />
            <span className='sr-only'>Select resume</span>
          </label>
        </div>
        {/* Resume Info */}
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <div className='w-17 h-17 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-widest text-2xl'>
            {name
              ?.split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className='flex flex-col self-stretch justify-between min-w-0'>
            <div className='flex flex-col gap-[1px] min-w-0'>
              <div className='font-semibold truncate capitalize'>{name?.toLowerCase()}</div>
              <div className='text-xs text-primary font-medium capitalize'>
                {topCategory?.toLowerCase()}
              </div>
            </div>
            <div className='flex gap-4 text-[10px] mb-[2px]'>
              <StatItem
                label='Years'
                icon='fa-solid fa-briefcase'
                value={yearsOfExperience}
              />
              <StatItem
                label='Jobs'
                icon='fa-solid fa-building'
                value={experiencesCount}
              />
              <StatItem
                label='Projects'
                icon='fa-solid fa-diagram-project'
                value={projectsCount}
              />
            </div>
          </div>
        </div>
        {/* Stats & Dropdown */}
        <div className='flex flex-col self-stretch justify-between items-end min-w-[110px]'>
          <div className='flex flex-col items-end gap-[1px]'>
            <div className='text-xs text-gray-500 mb-1'>{formatDate(lastUpdated)}</div>
            <div className='flex gap-2 items-center text-xs text-gray-500'>
              <span
                title='Likes'
                className='flex items-center gap-1'
              >
                <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
                {likes}
              </span>
              <span
                title='Comments'
                className='flex items-center gap-1'
              >
                <FontAwesomeIcon icon='fa-regular fa-comment' />
                {comments}
              </span>
            </div>
          </div>
          <DropdownMenu
            align='right'
            width='w-[250px]'
            trigger={
              <button
                className='rounded-full hover:bg-gray-200 h-8 w-8 text-gray-500 flex items-center justify-center cursor-pointer translate-y-2 translate-x-1'
                onClick={e => e.stopPropagation()}
              >
                <FontAwesomeIcon icon='fa-solid fa-ellipsis' />
              </button>
            }
            options={dropdownOptions}
          />
        </div>
      </li>
      {/* Remove from collection modal */}
      {showRemoveModal && (
        <DeleteConfirmationModal
          title='Remove Resume from Collection?'
          description='Are you sure you want to remove this resume from the collection?'
          confirmLabel='Remove'
          confirmColor='bg-red-600'
          onClose={() => setShowRemoveModal(false)}
          onConfirm={confirmRemove}
          loading={removeLoading}
        />
      )}
      {/* Add to Collection Drawer for bookmarks mode */}
      {mode === 'bookmarks' && (
        <>
          <AddToCollectionDrawer
            open={collectionPicker.open}
            onClose={collectionPicker.hide}
            collections={collectionPicker.collections}
            selectedIds={collectionPicker.selectedIds}
            toggleCollection={collectionPicker.toggleCollection}
            onSearch={collectionPicker.onSearch}
            searchQuery={collectionPicker.searchQuery}
            loading={collectionPicker.loading}
            canAdd={collectionPicker.canAdd}
            handleAddAndRemove={collectionPicker.handleAddAndRemove}
            error={collectionPicker.error}
            setError={collectionPicker.setError}
            onActuallyCreateNew={collectionPicker.onActuallyCreateNew}
            setToast={onShowToast}
            resumesToAdd={[{ uuid, resumeId, name }]}
          />
        </>
      )}
    </>
  );
};

export default ResumeItem;
