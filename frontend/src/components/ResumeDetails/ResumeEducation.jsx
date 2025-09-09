import React from 'react';

export default function ResumeEducation({ education }) {
  if (!education?.length) return null;
  return (
    <section className='flex flex-col gap-2 bg-[#F9F9F9] p-4 border-l-2 border-primary rounded-r-xl'>
      <h3 className='font-bold text-2xl text-primary'>Education</h3>
      <div className='h-[1px] bg-gray-200'></div>
      <div className='space-y-4'>
        {education.map((edu, i) => (
          <div
            key={i}
            className='rounded-xl'
          >
            <div className='font-semibold text-gray-900'>{edu.degree}</div>
            <div className='text-gray-400 text-xs font-semibold'>
              <span>{edu.institution}</span> &middot; <span>{edu.year}</span>
            </div>
            {edu.description && <div className='text-gray-700 text-sm mt-1'>{edu.description}</div>}

            {/* {i !== education.length - 1 && <div className='h-[1px] bg-gray-200 my-4'></div>} */}
          </div>
        ))}
      </div>
    </section>
  );
}
