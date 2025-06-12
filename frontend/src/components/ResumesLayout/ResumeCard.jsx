import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import ScoresBars from '@/components/ResumesLayout/ScoresBars';
import ResumeHeader from '@/components/ResumesLayout/ResumeHeader';
import Stats from '@/components/ResumesLayout/Stats';
import Actions from '@/components/ResumesLayout/Actions';
import ExploreProfileBtn from '@/components/ResumesLayout/ExploreProfileBtn';
import LanguagesTags from '@/components/ResumesLayout/LanguagesTags';
import { useResumeMetrics } from '@/hooks/resumes/useResumeMetrics';

const ResumeCard = ({ resume }) => {
  const {
    name,
    yearsOfExperience,
    experiences = [],
    projects = [],
    summary,
    languages = [],
    uuid,
  } = resume;

  const [searchParams] = useSearchParams();

  const {
    topCategory,
    formattedDate,
    matchingScore,
    categoryScoringData,
    skillScoringData,
    skillsSectionTitle,
  } = useResumeMetrics(resume, searchParams);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white p-5 rounded shadow flex flex-col gap-2 hover:shadow-lg transition-transform duration-300 hover:-translate-y-1'
    >
      <ResumeHeader
        name={name}
        title={topCategory}
        matchingScore={matchingScore}
        date={formattedDate}
      />

      <Stats
        yearsOfExperience={yearsOfExperience}
        experiences={experiences}
        projects={projects}
      />

      <p className='text-gray-500 text-xs text-justify hyphens-auto h-29 overflow-y-auto scrollbar-custom pr-2 tracking-wide leading-[19px] mb-4'>
        {summary}
      </p>

      {categoryScoringData.length > 0 && (
        <div className='mb-2'>
          <div className='mb-1 text-[11px] text-primary font-semibold uppercase tracking-wide'>
            Matching Categories
          </div>
          <ScoresBars criteria={categoryScoringData} />
        </div>
      )}

      {skillScoringData.length > 0 && (
        <div>
          <div className='mb-1 text-[11px] text-primary font-semibold uppercase tracking-wide'>
            {skillsSectionTitle}
          </div>
          <ScoresBars criteria={skillScoringData} />
        </div>
      )}

      <div className='flex-grow'></div>

      <div className='flex flex-col gap-2'>
        <LanguagesTags languages={languages} />
        <ExploreProfileBtn />
        <Actions uuid={uuid} />
      </div>
    </motion.div>
  );
};

export default ResumeCard;
