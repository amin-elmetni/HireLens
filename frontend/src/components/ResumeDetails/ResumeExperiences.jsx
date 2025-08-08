import React from 'react';

export default function ResumeExperiences({ experiences }) {
  if (!experiences?.length) return null;
  return (
    <section className='flex flex-col gap-2 bg-[#F9F9F9] p-4 border-l-2 border-primary rounded-r-xl mt-4'>
      <h3 className='font-bold text-xl text-primary'>Experiences</h3>
      <div className='h-[1px] bg-gray-200'></div>
      <div className='space-y-8'>
        {experiences.map((exp, i) => (
          <div
            key={i}
            className='rounded-xl'
          >
            <div className='font-semibold text-primary-900'>{exp.job_title}</div>
            <div className='text-gray-400 text-xs font-semibold'>
              <span>{exp.company}</span> &middot; <span>{exp.duration}</span>
            </div>
            <div className='text-gray-700 text-sm mt-1'>{exp.description}</div>

            {/* {i !== experiences.length - 1 && <div className='h-[1px] bg-gray-200 my-4'></div>} */}
          </div>
        ))}
      </div>
    </section>
  );
}
