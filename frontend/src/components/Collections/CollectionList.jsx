import React from 'react';
import CollectionItem from './CollectionItem';
import { useNavigate } from 'react-router-dom';

export default function CollectionList({ collections, onAction, onShowToast }) {
  const navigate = useNavigate();
  if (!collections.length) return <div className='text-gray-400 pt-8'>No collections found.</div>;
  return (
    <ul className='divide-y divide-gray-100'>
      {collections.map(col => (
        <CollectionItem
          key={col.id}
          collection={col}
          onAction={onAction}
          onShowToast={onShowToast}
          onClick={() => navigate(`/collections/${col.id}`)}
        />
      ))}
    </ul>
  );
}
