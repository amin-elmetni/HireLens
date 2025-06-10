// components/SearchableFilterSection.jsx
import React, { useMemo, useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const SearchableFilterSection = ({ title, items, selectedItems, onToggleItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, searchQuery]);

  const clearSearch = () => setSearchQuery('');

  return (
    <div className='mb-4'>
      <div
        className='flex items-center justify-between mb-4 cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className='text-lg font-semibold truncate'>{title}</h2>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <>
          {/* Search Input */}
          <div className='relative mb-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-primary text-sm transition-colors duration-200'
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>

          {/* Selected Items Chips */}
          {selectedItems.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {selectedItems.map(item => (
                <div
                  key={item.id}
                  className='flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm capitalize'
                >
                  <span>{item.label.toLowerCase()}</span>
                  <button
                    onClick={() => onToggleItem(item)}
                    className='ml-2 text-gray-500 hover:text-gray-700 cursor-pointer'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Items List */}
          <div className='max-h-60 overflow-y-auto scrollbar-custom space-y-1 pr-2'>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer ${
                    selectedItems.some(s => s.id === item.id) ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => onToggleItem(item)}
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center ${
                        selectedItems.some(s => s.id === item.id)
                          ? 'bg-primary border-primary text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedItems.some(s => s.id === item.id) && (
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className='text-gray-700 text-sm truncate max-w-[130px] 2xl:max-w-[230px] capitalize'
                      title={item.label}
                    >
                      {item.label.toLowerCase()}
                    </span>
                  </div>
                  <span
                    className={`text-gray-500 text-xs px-2 py-[1px] ml-2 bg-gray-100 rounded-full font-medium ${
                      selectedItems.some(s => s.id === item.id) && 'text-primary bg-transparent'
                    }`}
                  >
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <div className='text-center py-4 text-gray-500'>
                No {title.toLowerCase()} found matching "{searchQuery}"
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchableFilterSection;
