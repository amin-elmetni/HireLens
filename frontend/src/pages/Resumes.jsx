import React, { useState } from 'react';
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import { TbLayoutSidebarRightExpandFilled } from 'react-icons/tb';
import NavBar from '@/components/NavBar/NavBar';
import SideFilters from '@/components/SideFilters/SideFilters';
import ResumesLayout from '@/components/ResumeLayout/ResumesLayout';
import { useSideFilters } from '@/hooks/resumes/useSideFilters';

const Resumes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const { loading } = useSideFilters();

  return (
    <div className='bg-background min-h-screen'>
      <NavBar />
      <div className='relative flex transition-all duration-300 px-14 py-10 gap-4'>
        {/* Sticky Toggle Button */}
        <button
          onClick={() => {
            setSidebarOpen(prev => !prev);
            setIsClicked(true);
          }}
          onTransitionEnd={() => setIsClicked(false)}
          className={`
            fixed z-10 left-[-10px] top-32 transform -translate-y-1/2
            bg-white shadow-md border border-gray-200
            text-primary text-3xl pl-4 p-2 rounded
            hover:bg-primary hover:text-white hover:shadow-lg
            transition-all duration-300 cursor-pointer focus:outline-none 
            ${isClicked ? 'text-white bg-primary' : 'hover:translate-x-1'}
            ${sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          `}
          title={sidebarOpen ? 'Close Filters' : 'Open Filters'}
        >
          {sidebarOpen ? (
            <TbLayoutSidebarRightExpandFilled className='text-3xl' />
          ) : (
            <TbLayoutSidebarLeftExpandFilled className='text-3xl' />
          )}
        </button>

        {/* Sidebar Container */}
        <div className={`${sidebarOpen ? 'w-[23%]' : 'w-0'} transition-all duration-300`}>
          {/* Sticky Sidebar Content - Fixed height calculation */}
          <div
            className={`sticky top-[100px] h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden pr-6 scrollbar-custom`}
          >
            {sidebarOpen && (
              <>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-primary'>Filters</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className='text-primary text-3xl p-2 cursor-pointer hover:text-gray-400 hover:bg-gray-100 rounded-full transition-colors duration-200'
                    title='Close Filters'
                  >
                    <TbLayoutSidebarRightExpandFilled />
                  </button>
                </div>
                {loading ? (
                  <div className='text-center text-gray-500'>Loading filters...</div>
                ) : (
                  <SideFilters />
                )}{' '}
              </>
            )}
          </div>
        </div>

        {/* Resume Layout */}
        <div className={`${sidebarOpen ? 'w-[77%]' : 'w-full'} transition-all duration-300`}>
          <ResumesLayout />
        </div>
      </div>
    </div>
  );
};

export default Resumes;
