import React from 'react';

export default function ResumeProjects({ projects }) {
  if (!projects?.length) return null;
  return (
    <section className='flex flex-col gap-2 bg-[#F9F9F9] p-4 border-l-2 border-primary rounded-r-xl'>
      <h3 className='font-bold text-2xl text-primary'>Projects</h3>
      <div className='h-[1px] bg-gray-200'></div>
      <div className='space-y-4'>
        {projects.map((proj, i) => (
          <div
            key={i}
            className='rounded-xl'
          >
            <div className='font-semibold text-gray-900'>{proj.projectTitle}</div>
            {proj.technologies && (
              <div className='text-gray-400 text-xs font-semibold'>
                <span>{proj.technologies}</span>
              </div>
            )}
            <div className='text-gray-700 text-sm mt-1'>{proj.projectSummary}</div>

            {/* {i !== projects.length - 1 && <div className='h-[1px] bg-gray-200 my-4'></div>} */}
          </div>
        ))}
      </div>
    </section>
  );
}
