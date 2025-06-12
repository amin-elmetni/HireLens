import React from 'react';
import { motion } from 'framer-motion';

const getColorClasses = score => {
  if (score >= 80) return 'from-green-400 to-green-500';
  if (score >= 60) return 'from-blue-400 to-blue-500';
  if (score >= 40) return 'from-yellow-400 to-yellow-500';
  return 'from-red-400 to-red-500';
};

const getTextColor = score => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

// const uniqueCriteria = Array.from(
//   new Map(criteria.map(item => [item.name.toLowerCase(), item])).values()
// );

const ScoresBars = ({ criteria }) => (
  <div className='flex flex-col gap-2 mb-2'>
    {criteria.map(({ name, score }, index) => {
      const percent = Math.round(score * 100);
      return (
        <div
          key={`${name}-${index}`}
          className='flex items-center gap-2 text-xs'
        >
          <span className='w-24 font-bold text-gray-600 truncate'>{name}</span>
          <div className='flex-1 bg-gray-200 h-2 rounded relative overflow-hidden'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className={`h-full rounded bg-gradient-to-r ${getColorClasses(percent)}`}
              title={`${name} proficiency: ${percent}%`}
            />
          </div>
          <span className={`w-8 text-right font-medium ${getTextColor(percent)}`}>{percent}%</span>
        </div>
      );
    })}
  </div>
);

export default ScoresBars;
