import React from 'react';

const TextareaInput = React.forwardRef(({ label, ...props }, ref) => (
  <div className='relative group mb-6'>
    {label && (
      <span className='flex translate-y-[9px] translate-x-3 bg-white w-fit px-2 font-semibold uppercase text-[11px] text-gray-400 tracking-wide group-focus-within:text-primary group-hover:text-primary transition-colors duration-200'>
        {label}
      </span>
    )}
    <textarea
      ref={ref}
      className='w-full px-4 py-3 rounded border border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-primary hover:border-primary focus:ring focus:ring-primary transition-colors text-lg h-30 resize-none scrollbar-custom-2'
      {...props}
    />
  </div>
));

export default TextareaInput;
