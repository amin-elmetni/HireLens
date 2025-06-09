import React from 'react';
import { useSideFilters } from '@/hooks/useSideFilters';
import SearchableFilterSection from './SearchableFilterSection';
import ExperienceRangeFilter from './ExperienceRangeFilter';

const FILTER_SECTIONS = [
  { key: 'categories', title: 'Resume Categories' },
  { key: 'skills', title: 'Professional Skills' },
  { key: 'languages', title: 'Languages' },
];

const SideFilters = () => {
  const {
    filters,
    tempSelections,
    isExpanded,
    toggleExpand,
    toggleTempSelection,
    applySelections,
    handleExperienceChange,
    handleMinInputChange,
    handleMaxInputChange,
    handleReset,
    handleApply,
    min,
    max,
    loading,
  } = useSideFilters();

  if (loading || !filters) {
    return <div className='text-center text-gray-500'>Loading filters...</div>;
  }

  return (
    <div className='w-full rounded-lg flex flex-col gap-1'>
      {FILTER_SECTIONS.map(({ key, title }) => (
        <SearchableFilterSection
          key={key}
          title={title}
          items={filters[key]}
          selectedItems={tempSelections[key]}
          onToggleItem={item => toggleTempSelection(key, item)}
          onApplySelection={() => applySelections(key)}
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

      <div className='flex space-x-4'>
        <button
          onClick={handleApply}
          className='flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark cursor-pointer hover:opacity-85 transition font-medium'
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className='flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition cursor-pointer font-medium'
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SideFilters;
