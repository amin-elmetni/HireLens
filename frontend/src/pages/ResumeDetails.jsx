import React from 'react';
import { useParams } from 'react-router-dom';
import ResumeMainInfo from '@/components/ResumeDetails/ResumeMainInfo';
import ResumeAnalytics from '@/components/ResumeDetails/ResumeAnalytics';
import ResumeInfoBlocks from '@/components/ResumeDetails/ResumeInfoBlocks';
import ResumeLanguagesCerts from '@/components/ResumeDetails/ResumeLanguagesCerts';
import ResumeExperiences from '@/components/ResumeDetails/ResumeExperiences';
import ResumeProjects from '@/components/ResumeDetails/ResumeProjects';
import ResumeEducation from '@/components/ResumeDetails/ResumeEducation';
import ResumeComments from '@/components/ResumeDetails/ResumeComments';
import ResumeSuggestionsSidebar from '@/components/ResumeDetails/ResumeSuggestionsSidebar';
import NavBar from '@/components/NavBar/NavBar';
import useResumeMetadataByUuid from '@/hooks/resumes/useResumeMetadataByUuid';

export default function ResumeDetails() {
  const { uuid } = useParams();
  const { metadata: resume, loading, error } = useResumeMetadataByUuid(uuid);

  // If you want to fetch comments/similarResumes dynamically, you can add more hooks or API calls here

  if (loading) return <div className='text-center py-20'>Loading...</div>;
  if (error) return <div className='text-center py-20 text-red-500'>{error.message || error}</div>;
  if (!resume) return null;

  return (
    <div className='bg-white min-h-screen pb-12'>
      <NavBar />
      <div className='max-w-[105rem] mx-auto px-6 lg:px-24 pt-10 mt-4'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Main column */}
          <div className='lg:col-span-3 flex flex-col gap-8 mr-5'>
            <ResumeMainInfo resume={resume} />
            <div className='h-[1px] bg-gray-200'></div>
            <div>
              <div className='font-bold text-lg mb-2 text-primary'>About</div>
              <div className='text-gray-700 text-base'>{resume.summary}</div>
            </div>
            <ResumeInfoBlocks resume={resume} />
            <ResumeAnalytics resume={resume} />
            <ResumeExperiences experiences={resume.experiences} />
            <ResumeProjects projects={resume.projects} />
            <ResumeEducation education={resume.education} />
            <ResumeLanguagesCerts resume={resume} />
            <div className='mt-2'></div>
            {/* You may need to fetch comments separately if not included in metadata */}
            <ResumeComments comments={resume.comments || []} />
          </div>
          {/* Sidebar: Download + Similar */}
          <ResumeSuggestionsSidebar
            resume={resume}
            similarResumes={resume.similarResumes || []}
          />
        </div>
      </div>
    </div>
  );
}
