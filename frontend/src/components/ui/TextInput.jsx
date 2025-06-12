import React from 'react';

export const TextInput = React.forwardRef(({ label, ...props }, ref) => (
  <div className='relative group mb-2'>
    {label && (
      <span className='flex translate-y-[9px] translate-x-3 bg-white w-fit px-2 font-semibold uppercase text-[11px] text-gray-400 tracking-wide group-focus-within:text-primary group-hover:text-primary transition-colors duration-200'>
        {label}
      </span>
    )}
    <input
      ref={ref}
      type='text'
      className='w-full px-4 py-3 rounded border border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-primary focus:ring focus:ring-primary hover:border-primary transition-colors text-lg'
      {...props}
    />
  </div>
));

export default TextInput;
