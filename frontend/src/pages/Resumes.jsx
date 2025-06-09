import NavBar from '@/components/NavBar/NavBar';
import SideFilters from '@/components/SideFilters/SideFilters';
import ResumesLayout from '@/components/ResumeLayout/ResumesLayout';
import React from 'react';

const Resumes = () => {
  return (
    <div className='bg-background min-h-screen'>
      <NavBar />
      <div className='flex gap-10 px-16 py-10'>
        <div className='w-[20%]'>
          <SideFilters />
        </div>
        <div className='w-[80%]'>
          <ResumesLayout />
        </div>
      </div>
    </div>
  );
};

export default Resumes;
