import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropdownMenu from '../ui/DropdownMenu';
import RenameCollectionModal from './RenameCollectionModal';
import DeleteCollectionModal from './DeleteCollectionModal';
import { getItemsByCollection } from '@/api/collectionItemApi';

export default function CollectionItem({ collection, onAction, onShowToast, onClick }) {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [count, setCount] = useState(collection.count ?? null);

  useEffect(() => {
    let cancelled = false;
    if (count == null && collection.id) {
      getItemsByCollection(collection.id).then(res => {
        if (!cancelled) setCount(res.data.length);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [collection.id, count]);

  return (
    <>
      <li
        className='flex items-center py-4 px-4 hover:bg-gray-50 group cursor-pointer relative'
        onClick={onClick}
      >
        {/* <span className='mr-4 text-xl'>📁</span> */}
        <FontAwesomeIcon
          icon='fa-regular fa-folder'
          className='mr-4 text-xl'
        />
        <span className='font-semibold text-md'>{collection.name}</span>
        <span className='text-gray-500 ml-2'>
          ({count !== null ? count : <span className='animate-pulse'>...</span>})
        </span>
        <div className='ml-auto'>
          <div
            className='ml-auto'
            onClick={e => e.stopPropagation()}
          >
            <DropdownMenu
              align='right'
              width='w-44'
              trigger={
                <button className='p-2 rounded-full hover:bg-gray-200 h-8 w-8 text-gray-500 group-hover:text-black flex items-center justify-center cursor-pointer'>
                  <FontAwesomeIcon icon='fa-solid fa-ellipsis' />
                </button>
              }
              options={[
                {
                  label: 'Rename',
                  value: 'rename',
                  onClick: e => {
                    e?.stopPropagation?.(); // For extra safety if DropdownMenu passes event
                    setShowRenameModal(true);
                  },
                },
                {
                  label: 'Delete',
                  value: 'delete',
                  onClick: e => {
                    e?.stopPropagation?.();
                    setShowDeleteModal(true);
                  },
                  destructive: true,
                },
              ]}
            />
          </div>
        </div>
      </li>
      {showRenameModal && (
        <RenameCollectionModal
          collection={collection}
          currentName={collection.name}
          onClose={() => setShowRenameModal(false)}
          onRenamed={() => {
            onAction?.();
            onShowToast?.('Collection updated!');
            setShowRenameModal(false);
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteCollectionModal
          collection={collection}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={() => {
            onAction?.();
            onShowToast?.('Collection deleted!');
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
}
