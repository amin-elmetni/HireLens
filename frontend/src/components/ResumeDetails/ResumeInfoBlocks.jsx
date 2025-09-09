import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const InfoBlock = ({ value, icon, label }) => (
  <div className='bg-primary/3 rounded-xl border-b-4 border-primary shadow p-4 flex flex-col items-center'>
    <div className='text-xl font-bold text-primary flex items-center'>
      <span>{value}</span>
      <FontAwesomeIcon
        icon={icon}
        className='ml-2'
      />
    </div>
    <span className='text-xs text-gray-500 mt-1 font-semibold'>{label}</span>
  </div>
);

export default function ResumeInfoBlocks({ resume }) {
  const blocks = [
    {
      value: resume.yearsOfExperience,
      icon: 'fa-solid fa-briefcase',
      label: 'Years Exp',
    },
    {
      value: resume.experiences.length,
      icon: 'fa-solid fa-building',
      label: 'Experiences',
    },
    {
      value: resume.experiences.length,
      icon: 'fa-solid fa-diagram-project',
      label: 'Projects',
    },
    {
      value: resume.languages.length,
      icon: 'fa-solid fa-language',
      label: 'Languages',
    },
    {
      value: resume.certifications.length,
      icon: 'fa-solid fa-graduation-cap',
      label: 'Certifications',
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-4'>
      {blocks.map((block, index) => (
        <InfoBlock
          key={index}
          value={block.value}
          icon={block.icon}
          label={block.label}
        />
      ))}
    </div>
  );
}
