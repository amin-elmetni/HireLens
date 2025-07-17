import React from 'react';
import { TbLayoutSidebarRightExpandFilled } from 'react-icons/tb';
import { useSideFilters } from '@/hooks/resumes/useSideFilters';
import SearchableFilterSection from './SearchableFilterSection';
import ExperienceRangeFilter from './ExperienceRangeFilter';

const FILTER_SECTIONS = [
  { key: 'categories', title: 'Resume Categories' },
  { key: 'skills', title: 'Professional Skills' },
  { key: 'languages', title: 'Languages' },
];

const SideFilters = ({ onClose }) => {
  const {
    filters,
    tempSelections,
    isExpanded,
    toggleExpand,
    toggleTempSelection,
    handleExperienceChange,
    handleMinInputChange,
    handleMaxInputChange,
    handleReset,
    handleApply,
    min,
    max,
  } = useSideFilters();

  return (
    <div className='w-full h-full flex flex-col'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold text-primary'>Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className='text-primary text-3xl p-2 cursor-pointer hover:text-gray-400 hover:bg-gray-100 rounded-full transition-colors duration-200'
            title='Close Filters'
          >
            <TbLayoutSidebarRightExpandFilled />
          </button>
        )}
      </div>
      {/* Scrollable filter list with bottom padding */}
      <div className='flex-1 overflow-y-auto pr-8 scrollbar-custom flex flex-col'>
        {' '}
        {FILTER_SECTIONS.map(({ key, title }) => (
          <SearchableFilterSection
            key={key}
            title={title}
            items={filters[key]}
            selectedItems={tempSelections[key]}
            onToggleItem={item => toggleTempSelection(key, item)}
          />
        ))}
        <ExperienceRangeFilter
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
          range={filters.experienceRange}
          onRangeChange={handleExperienceChange}
          onMinChange={handleMinInputChange}
          onMaxChange={handleMaxInputChange}
          min={min}
          max={max}
        />
      </div>

      {/* Sticky footer for buttons */}
      <div className='sticky bottom-0 left-0 right-0 pt-3 pb-4 px-2 z-20 flex items-center justify-center gap-3'>
        <button
          onClick={handleApply}
          className='flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark cursor-pointer hover:opacity-85 transition font-bold'
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className='flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition cursor-pointer font-bold'
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SideFilters;
