import React from 'react';

export default function ResumeLanguagesCerts({ resume }) {
  return (
    <div className='flex flex-col'>
      {/* Certifications Section - Wider */}
      {resume.certifications?.length > 0 && (
        <section className='flex-1 flex flex-col gap-2 bg-[#F9F9F9] p-4 border-l-2 border-primary rounded-r-xl'>
          <h3 className='font-bold text-xl text-primary'>Certifications</h3>
          <div className='h-[1px] bg-gray-200'></div>
          <ul className='text-gray-700 text-sm space-y-2 mt-2'>
            {resume.certifications.map((cert, i) => (
              <li
                key={i}
                className='flex items-start'
              >
                <span className='mr-2'>•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages Section */}
      {resume.languages?.length > 0 && (
        <div className='flex flex-wrap gap-3 mt-6'>
          {resume.languages.map((lang, i) => (
            <div
              key={i}
              className='bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2'
            >
              <span className='text-primary'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.954-1.155 19.698 19.698 0 01-3.339-5.414H3a1 1 0 110-2h2V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              <span className='text-sm font-medium text-gray-700'>{lang}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
