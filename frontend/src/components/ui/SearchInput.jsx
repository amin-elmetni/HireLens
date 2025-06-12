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
      className='w-full pl-4 pr-6 py-3 bg-transparent focus:outline-none'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
));

export default SearchInput;
