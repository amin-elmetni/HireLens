import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getInitials, formatDate, extractUsernameFromUrl } from '@/utils/generalUtils';
import { IoLocationOutline } from 'react-icons/io5';
import { useLikes } from '@/hooks/resumes/useLikes';
import { useComments } from '@/hooks/resumes/useComments';
import { useResumeMetrics } from '@/hooks/resumes/useResumeMetrics';
import { useSaves } from '@/hooks/resumes/useSaves';
import { useSearchParams } from 'react-router-dom';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { useResumeActions } from '@/hooks/resumes/useResumeActions';
import { useMultiCollectionPicker } from '@/hooks/resumes/useMultiCollectionPicker';
import AddToCollectionDrawer from '@/components/Resumes/ResumesLayout/AddToCollectionDrawer';
// import ToggleIconButton from '@/components/ui/ToggleIconButton';

export default function ResumeMainInfo({ resume }) {
  const { name, email, phone, personalLinks, address, finalScore, lastUpdated, uuid } = resume;

  const [searchParams] = useSearchParams();
  const { topCategory } = useResumeMetrics(resume, searchParams);

  const toPercent = x => Math.round((x || 0) * 100);
  const { liked, likeCount, toggleLike } = useLikes(uuid);
  const { commentCount } = useComments(uuid);
  const { saved, toggleSave } = useSaves(uuid);

  // Resume actions
  const { viewResume, downloadResume } = useResumeActions();

  // Add to collection drawer logic
  const collectionPicker = useMultiCollectionPicker(uuid);
  const ellipsisRef = useRef();

  // Handlers for dropdown
  const handleViewResume = () => viewResume(uuid);
  const handleDownloadResume = () => downloadResume(uuid);
  const handleAddToCollection = () => collectionPicker.show();

  const handleToggleLike = async () => {
    await toggleLike();
  };

  const handleToggleSave = async () => {
    await toggleSave();
  };

  const dropdownOptions = [
    {
      label: 'View Resume',
      value: 'view',
      icon: <FontAwesomeIcon icon='fa-regular fa-eye' />,
      onClick: handleViewResume,
    },
    {
      label: 'Download Resume',
      value: 'download',
      icon: <FontAwesomeIcon icon='fa-regular fa-circle-down' />,
      onClick: handleDownloadResume,
    },
    {
      label: 'Add to Collection',
      value: 'addToCollection',
      icon: <FontAwesomeIcon icon='fa-regular fa-folder-open' />,
      onClick: handleAddToCollection,
    },
    {
      label: saved ? 'Remove Bookmark' : 'Bookmark',
      value: 'save',
      icon: saved ? (
        <FontAwesomeIcon
          icon='fa-solid fa-bookmark'
          className='text-yellow-400'
        />
      ) : (
        <FontAwesomeIcon icon='fa-regular fa-bookmark' />
      ),
      onClick: handleToggleSave,
    },
    {
      label: liked ? 'Unlike' : 'Like',
      value: 'like',
      icon: liked ? (
        <FontAwesomeIcon
          icon='fa-solid fa-heart'
          className='text-red-500'
        />
      ) : (
        <FontAwesomeIcon icon='fa-regular fa-heart' />
      ),
      onClick: handleToggleLike,
    },
  ];

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <div>
            <div className='w-22 h-22 rounded-xl bg-primary flex items-center justify-center text-white text-3xl font-bold shadow'>
              {getInitials(name)}
            </div>
          </div>
          <div className='flex-1 flex flex-col gap-[6px]'>
            <div className='flex items-center gap-3 flex-wrap '>
              <span className='text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-semibold'>
                {topCategory}
              </span>
              <div className='flex gap-3 text-sm items-center'>
                <div className='flex gap-[3px] items-center text-primary font-bold cursor-default'>
                  <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
                  <span>{likeCount}</span>
                </div>
                <div className='flex gap-[3px] items-center text-primary font-bold cursor-default'>
                  <FontAwesomeIcon icon='fa-regular fa-comment' />
                  <span>{commentCount}</span>
                </div>
                <div className='flex items-center gap-2 text-xl ml-2'>
                  {/* <ToggleIconButton
                    onClick={handleToggleLike}
                    regularIcon='fa-regular fa-heart'
                    solidIcon='fa-solid fa-heart'
                    activeColor='text-red-500'
                    isActive={liked}
                    size='w-5 h-5'
                  />
                  <ToggleIconButton
                    onClick={handleToggleSave}
                    regularIcon='fa-regular fa-bookmark'
                    solidIcon='fa-solid fa-bookmark'
                    activeColor='text-yellow-400'
                    isActive={saved}
                    size='w-5 h-5'
                  /> */}
                </div>
              </div>
            </div>
            <h1 className='text-2xl font-bold capitalize'>{name.toLowerCase()}</h1>
            <div className='flex items-center gap-1 text-sm text-gray-500'>
              <IoLocationOutline className='text-[16px]' />
              <span>
                {address.city}, {address.country}
              </span>
            </div>
          </div>
          <div className='flex flex-col items-center gap-1 min-w-[120px] relative'>
            <div className='flex items-center justify-between w-full'>
              <span className='text-xs text-gray-400'>{formatDate(lastUpdated)}</span>
              <DropdownMenu
                options={dropdownOptions}
                trigger={
                  <span ref={ellipsisRef}>
                    <FontAwesomeIcon
                      icon='fa-ellipsis'
                      className='rounded-full hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer p-2'
                      title='More actions'
                    />
                  </span>
                }
                align='right'
                width='w-52'
              />
            </div>
            <div className='flex flex-col items-center'>
              <div className='relative w-22 h-22'>
                <svg
                  className='transform -rotate-90 w-full h-full'
                  viewBox='0 0 100 100'
                >
                  <circle
                    cx='50'
                    cy='50'
                    r='45'
                    className='stroke-gray-200'
                    strokeWidth='9'
                    fill='none'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='45'
                    className='stroke-primary transition-all duration-700'
                    strokeWidth='9'
                    fill='none'
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={(2 * Math.PI * 45 * (100 - toPercent(finalScore))) / 100}
                    strokeLinecap='round'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center flex-col'>
                  <span className='text-lg font-bold text-primary'>{toPercent(finalScore)}%</span>
                  <span className='text-xs text-gray-400'>Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(email || phone || personalLinks?.github || personalLinks?.linkedin) && (
          <div className='flex gap-6 text-sm font-semibold text-gray-600'>
            {email && (
              <span className='flex items-center'>
                <FontAwesomeIcon
                  icon='fa-solid fa-envelope'
                  className='mr-[6px]'
                />
                {email}
              </span>
            )}
            {phone && (
              <span className='flex items-center'>
                <FontAwesomeIcon
                  icon='fa-solid fa-phone'
                  className='mr-[6px]'
                />
                {phone}
              </span>
            )}
            {personalLinks?.github && (
              <a
                href={personalLinks.github}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-700  flex items-center'
              >
                <FontAwesomeIcon
                  icon='fa-brands fa-github'
                  className='mr-[6px] text-lg text-orange-600'
                />
                <span>Github</span>
              </a>
            )}
            {personalLinks?.linkedin && (
              <a
                href={personalLinks.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-700  flex items-center'
              >
                <FontAwesomeIcon
                  icon='fa-brands fa-linkedin'
                  className='mr-[6px] text-lg text-blue-600'
                />
                <span>Linkdin</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Add to Collection Drawer */}
      <AddToCollectionDrawer
        open={collectionPicker.open}
        onClose={collectionPicker.hide}
        collections={collectionPicker.collections}
        selectedIds={collectionPicker.selectedIds}
        toggleCollection={collectionPicker.toggleCollection}
        onSearch={collectionPicker.onSearch}
        searchQuery={collectionPicker.searchQuery}
        handleAddAndRemove={collectionPicker.handleAddAndRemove}
        loading={collectionPicker.loading}
        canAdd={collectionPicker.canAdd}
        error={collectionPicker.error}
        setError={collectionPicker.setError}
        onActuallyCreateNew={collectionPicker.onActuallyCreateNew}
        setToast={() => {}}
      />
    </>
  );
}
