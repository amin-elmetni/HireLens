import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropdownMenu from '../ui/DropdownMenu';
import { useResumeActions } from '@/hooks/resumes/useResumeActions';
import { useSaves } from '@/hooks/resumes/useSaves';
import { removeItemFromCollection } from '@/api/collectionItemApi';
import { formatDate } from '@/utils/generalUtils';
import RemoveResumeModal from './RemoveResumeModal';

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
}) => {
  const { viewResume, downloadResume } = useResumeActions();
  const { saved, toggleSave } = useSaves(uuid);

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleRemove = async () => {
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    await removeItemFromCollection(collectionId, resumeId);
    setShowRemoveModal(false);
    if (onRemovedSingle) onRemovedSingle();
  };

  return (
    <>
      <li className='flex items-center justify-between py-4 gap-3 hover:bg-gray-50 transition-colors cursor-pointer px-8'>
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
              <div className='font-semibold truncate'>{name}</div>
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
            options={[
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
                  downloadResume(uuid);
                },
              },
              {
                label: 'Remove From Collection',
                value: 'remove',
                icon: <FontAwesomeIcon icon='fa-regular fa-trash-can' />,
                onClick: e => {
                  e?.stopPropagation?.();
                  handleRemove();
                },
                destructive: true,
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
                  toggleSave();
                },
              },
            ]}
          />
        </div>
      </li>
      {showRemoveModal && (
        <RemoveResumeModal
          onClose={() => setShowRemoveModal(false)}
          onConfirm={confirmRemove}
        />
      )}
    </>
  );
};

export default ResumeItem;
