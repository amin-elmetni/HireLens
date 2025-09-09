import React from 'react';
import ScoresBars from '@/components/Resumes/ResumesLayout/ScoresBars';

export default function ResumeAnalytics({ resume }) {
  const topSkills = [...resume.skills].sort((a, b) => b.score - a.score).slice(0, 5);
  const otherSkills = [...resume.skills].sort((a, b) => b.score - a.score).slice(5);
  const toPercent = x => Math.round((x || 0) * 100);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
      {topSkills.length > 0 && (
        <div>
          <div className='font-bold text-primary mb-2 uppercase text-sm tracking-wider'>
            Top Skills
          </div>
          <ScoresBars criteria={topSkills.map(s => ({ name: s.name, score: s.score }))} />
        </div>
      )}
      {resume.categories?.length > 0 && (
        <div>
          <div className='font-bold text-primary mb-2 uppercase text-sm tracking-wider'>
            Categories
          </div>
          <ScoresBars criteria={resume.categories.map(c => ({ name: c.name, score: c.score }))} />
        </div>
      )}
      {otherSkills.length > 0 && (
        <div className='md:col-span-2'>
          <div className='font-bold text-primary mb-2 uppercase text-sm tracking-wider'>
            All Skills
          </div>
          <div className='flex flex-wrap gap-2'>
            {otherSkills.map(s => (
              <span
                key={s.name}
                className='bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium'
              >
                {s.name} <span className='font-bold ml-1'>{toPercent(s.score)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
