import React from 'react';

const tabs = [
  { label: 'Collections', value: 'collections' },
  { label: 'Bookmarks', value: 'bookmarks' },
];

export default function CollectionTabs({ activeTab, onTabChange }) {
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
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
