import React from 'react';

const LanguagesTags = ({ languages = [] }) => (
  <div className='flex flex-wrap gap-1 mb-2'>
    {languages.map(lang => (
      <span
        key={lang}
        className='text-[10px] bg-primary/10 text-primary px-2 py-[1px] rounded-full'
      >
        {lang}
      </span>
    ))}
  </div>
);

export default LanguagesTags;
