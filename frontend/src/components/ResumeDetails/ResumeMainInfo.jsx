import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getInitials, formatDate, extractUsernameFromUrl } from '@/utils/generalUtils';
import { IoLocationOutline } from 'react-icons/io5';

export default function ResumeMainInfo({ resume }) {
  const {
    name,
    email,
    phone,
    personal_links,
    categories,
    years_of_experience,
    address,
    final_score,
    last_updated,
    uuid,
    age,
  } = resume;
  const category = categories?.[0]?.name || 'Uncategorized';
  const toPercent = x => Math.round((x || 0) * 100);
  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <div>
            <div className='w-22 h-22 rounded-xl bg-primary flex items-center justify-center text-white text-3xl font-bold shadow'>
              {getInitials(name)}
            </div>
          </div>
          <div className='flex-1 flex flex-col gap-[6px]'>
            <div className='flex items-center gap-3 flex-wrap '>
              <span className='text-xs bg-purple-100 text-primary px-3 py-1 rounded-full font-semibold'>
                {category}
              </span>
              <div className='flex gap-2 text-sm'>
                <div className='flex gap-[3px] items-center text-primary font-bold'>
                  <FontAwesomeIcon icon='fa-regular fa-thumbs-up' />
                  <span>4</span>
                </div>
                <div className='flex gap-[3px] items-center text-primary font-bold'>
                  <FontAwesomeIcon icon='fa-regular fa-comment' />
                  <span>6</span>
                </div>
              </div>
            </div>
            <h1 className='text-2xl font-bold'>{name}</h1>
            <div className='flex items-center gap-1 text-sm'>
              <IoLocationOutline className='text-[16px]' />
              <span>
                {address.city}, {address.country}
              </span>
            </div>
          </div>
          <div className='flex flex-col items-center gap-4 min-w-[120px]'>
            <span className='text-xs text-gray-400'>{formatDate(last_updated)}</span>
            <div className='flex flex-col items-center'>
              <div className='relative w-22 h-22'>
                <svg
                  className='transform -rotate-90 w-full h-full'
                  viewBox='0 0 100 100'
                >
                  <circle
                    cx='50'
                    cy='50'
                    r='45'
                    className='stroke-gray-200'
                    strokeWidth='9'
                    fill='none'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='45'
                    className='stroke-primary transition-all duration-700'
                    strokeWidth='9'
                    fill='none'
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={(2 * Math.PI * 45 * (100 - toPercent(final_score))) / 100}
                    strokeLinecap='round'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center flex-col'>
                  <span className='text-lg font-bold text-primary'>{toPercent(final_score)}%</span>
                  <span className='text-xs text-gray-400'>Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex gap-6 text-sm font-semibold'>
          <span className='flex items-center'>
            <FontAwesomeIcon
              icon='fa-solid fa-envelope'
              className='mr-[6px]'
            />
            {email}
          </span>
          <span className='flex items-center'>
            <FontAwesomeIcon
              icon='fa-solid fa-phone'
              className='mr-[6px]'
            />
            {phone}
          </span>
          {personal_links?.github && (
            <a
              href={personal_links.github}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-700  flex items-center'
            >
              <FontAwesomeIcon
                icon='fa-brands fa-github'
                className='mr-[6px] text-lg text-orange-600'
              />
              <span>Github</span>
            </a>
          )}
          {personal_links?.linkedin && (
            <a
              href={personal_links.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-700  flex items-center'
            >
              <FontAwesomeIcon
                icon='fa-brands fa-linkedin'
                className='mr-[6px] text-lg text-blue-600'
              />
              <span>Linkdin</span>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
