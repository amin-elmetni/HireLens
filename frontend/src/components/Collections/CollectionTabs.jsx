import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Collections', value: 'collections', path: '/collections' },
  { label: 'Bookmarks', value: 'bookmarks', path: '/bookmarks' },
];

export default function CollectionTabs({ activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='flex border-b border-gray-200 mb-6 pl-2'>
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`px-4 py-3 text-base font-medium transition-colors cursor-pointer ${
            activeTab === tab.value
              ? 'border-b-2 border-primary text-black font-bold'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => {
            navigate(tab.path);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
