import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatItem = ({ icon, value, label }) => (
  <div className='flex items-center gap-1 bg-gray-100 rounded-full px-2 py-[5px]'>
    <FontAwesomeIcon
      icon={icon}
      className='text-primary text-xs'
    />
    <span className='font-semibold'>{value}</span>
    <span className='text-gray-500'>{label}</span>
  </div>
);

const Stats = ({ yearsOfExperience = 0, experiences = [], projects = [] }) => (
  <div className='flex items-center justify-between text-[10px] text-gray-600 mb-2'>
    <StatItem
      icon='fa-solid fa-briefcase'
      value={yearsOfExperience}
      label='Years'
    />
    <StatItem
      icon='fa-solid fa-building'
      value={experiences.length}
      label='Jobs'
    />
    <StatItem
      icon='fa-solid fa-diagram-project'
      value={projects.length}
      label='Projects'
    />
  </div>
);

export default Stats;
