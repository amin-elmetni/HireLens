import React from 'react';
import CollectionItem from './CollectionItem';

export default function CollectionList({ collections, onAction, onShowToast }) {
  if (!collections.length) return <div className='text-gray-400 pt-8'>No collections found.</div>;
  return (
    <ul className='divide-y divide-gray-100'>
      {collections.map(col => (
        <CollectionItem
          key={col.id}
          collection={col}
          onAction={onAction}
          onShowToast={onShowToast}
        />
      ))}
    </ul>
  );
}
