import React from 'react';
import ResumeItem from './ResumeItem';
import BackCancelButton from '../ui/BackCancelButton';
import useCollectionResumes from '@/hooks/collections/useCollectionResumes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CollectionResumesList({ collection, onBack }) {
  const { resumes, loading } = useCollectionResumes(collection?.id);

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
        {/* <span className='mr-2'>📁</span> */}
        <FontAwesomeIcon
          icon='fa-regular fa-folder'
          className='mr-4'
        />
        {collection.name}
      </h2>
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
            />
          ))}
        </ul>
      )}
    </div>
  );
}
