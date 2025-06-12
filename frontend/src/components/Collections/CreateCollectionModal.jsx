import React from 'react';
import BackCancelButton from '../ui/BackCancelButton';
import PrimaryButton from '../ui/PrimaryButton';
import TextInput from '../ui/TextInput';
import TextareaInput from '../ui/TextareaInput';

export default function CreateCollectionModal({ onClose, onCreated }) {
  // TODO: implement form and call onCreated after successful creation
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]'>
      <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-md'>
        <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>New Collection</h3>
        {/* Form goes here */}
        <TextInput
          // ref={newCollectionInputRef}
          label='Collection Name'
          placeholder='Untitled collection'
          // value={newCollectionName}
          // onChange={handleInputChange}
          maxLength={50}
        />
        <TextareaInput
          // ref={newCollectionDescriptionRef}
          label='Description'
          placeholder='Describe your new collection'
          // value={newCollectionDescription}
          // onChange={handleDescriptionChange}
          maxLength={150}
        />
        <div className='flex gap-3 justify-end mt-4'>
          <BackCancelButton
            onClick={onClose}
            text='Cancel'
          />
          <PrimaryButton>Create</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
