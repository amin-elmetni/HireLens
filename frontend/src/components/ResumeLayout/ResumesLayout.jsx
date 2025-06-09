import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResumeCard from '@/components/ResumeLayout/ResumeCard';
import { useFilteredResumes } from '@/hooks/useFilteredResumes';

const normalize = s => s.toLowerCase().replace(/\s+/g, '_');

const ResumesLayout = () => {
  const { resumes, loading } = useFilteredResumes();
  const [searchParams] = useSearchParams();

  const hasFilters = ['skills', 'categories', 'languages', 'expMin', 'expMax'].some(key =>
    searchParams.has(key)
  );

  const sortedResumes = useMemo(() => {
    const skillIds = (searchParams.get('skills') || '').split(',').map(normalize);
    const categoryIds = (searchParams.get('categories') || '').split(',').map(normalize);

    return [...resumes]
      .map(resume => {
        const skills = resume.skills || [];
        const categories = resume.categories || [];

        const matchedSkills = skills.filter(s => skillIds.includes(normalize(s.name)));
        const matchedCategories = categories.filter(c => categoryIds.includes(normalize(c.name)));

        let score = 0;
        if (matchedSkills.length > 0) {
          score = matchedSkills.reduce((sum, s) => sum + s.score, 0) / matchedSkills.length;
        } else if (matchedCategories.length > 0) {
          score = matchedCategories.reduce((sum, c) => sum + c.score, 0) / matchedCategories.length;
        } else {
          score = resume.finalScore ?? 0;
        }

        return { ...resume, _matchingScore: Math.round(score * 100) };
      })
      .sort((a, b) => b._matchingScore - a._matchingScore);
  }, [resumes, searchParams]);

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold'>
          {hasFilters ? sortedResumes.length : 0}{' '}
          <span className='font-light text-gray-400'>Resumes Found</span>
        </h1>
        <h2>
          <span className='text-gray-400'>Sort by :</span>
          <select className='border-none outline-none rounded py-1 font-semibold px-1'>
            <option value='score'>Score</option>
            <option value='date'>Date</option>
            <option value='likes'>Likes</option>
            <option value='comments'>Comments</option>
          </select>
        </h2>
      </div>

      {!hasFilters ? (
        <div className='text-center text-gray-500 mt-10'>
          Please select at least one filter to view resumes.
        </div>
      ) : loading ? (
        <div className='text-center text-gray-500'>Loading resumes...</div>
      ) : sortedResumes.length === 0 ? (
        <div className='text-center text-gray-500'>No resumes found.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
          {sortedResumes.map(resume => (
            <ResumeCard
              key={resume.id}
              resume={resume}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesLayout;
