import React, { useEffect, useState } from 'react';

const MatchingScoreCircle = ({ percentage }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progress = (circumference * (100 - percentage)) / 100;
    const timer = setTimeout(() => setOffset(progress), 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  const getCircleColor = () => {
    if (percentage >= 80) return 'stroke-green-500';
    if (percentage >= 60) return 'stroke-blue-500';
    if (percentage >= 40) return 'stroke-yellow-400';
    return 'stroke-red-500';
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className='flex justify-center'>
      <div className='relative w-16 h-16'>
        <svg
          className='transform -rotate-90'
          viewBox='0 0 100 100'
        >
          <circle
            cx='50'
            cy='50'
            r={radius}
            className='stroke-gray-200'
            strokeWidth='9'
            fill='none'
          />
          <circle
            cx='50'
            cy='50'
            r={radius}
            className={`${getCircleColor()} transition-all duration-700`}
            strokeWidth='9'
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center flex-col'>
          <span className={`text-sm font-bold ${getTextColor()}`}>{percentage}%</span>
          <span className='text-[10px] text-gray-500'>Match</span>
        </div>
      </div>
    </div>
  );
};

export default MatchingScoreCircle;
