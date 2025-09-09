import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchInput = React.forwardRef(({ value, onChange, placeholder, className = '' }, ref) => (
  <div
    className={`flex items-center pl-6 rounded-full text-gray-900 border border-gray-200 focus-within:border-primary focus-within:ring focus-within:ring-primary hover:border-primary transition-colors ${className}`}
  >
    <FontAwesomeIcon
      icon='fa-solid fa-magnifying-glass'
      className='text-gray-900'
    />
    <input
      ref={ref}
      type='text'
      className='w-full pl-4 pr-2 py-3 bg-transparent focus:outline-none'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {value && value.length > 0 && (
      <button
        type='button'
        onClick={() => onChange({ target: { value: '' } })}
        className='pr-4 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer'
        aria-label='Clear search'
      >
        <FontAwesomeIcon icon='fa-solid fa-xmark' />
      </button>
    )}
  </div>
));

export default SearchInput;
