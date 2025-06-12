import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatItem = ({ icon, value, label }) => (
  <div className='flex items-center gap-1 bg-gray-100 rounded-full px-2 py-[5px]'>
    <FontAwesomeIcon
      icon={icon}
      className='text-primary text-xs'
    />
    <span>{value}</span>
    <span>{label}</span>
  </div>
);

const Stats = ({ yearsOfExperience = 0, experiences = [], projects = [] }) => (
  <div className='flex items-center gap-4 text-[10px] text-gray-800 mb-2 font-semibold'>
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
