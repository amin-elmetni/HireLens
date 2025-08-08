import React, { useState, useEffect } from 'react';
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from 'react-icons/tb';
import NavBar from '@/components/NavBar/NavBar';
import SideFilters from '@/components/Resumes/SideFilters/SideFilters';
import ResumesLayout from '@/components/Resumes/ResumesLayout/ResumesLayout';
import { useSideFilters } from '@/hooks/resumes/useSideFilters';
import { useNavigate, useLocation } from 'react-router-dom';
import JobDescriptionInput from '@/components/Resumes/JobDescriptionInput';

const DEFAULT_EXP_MIN = 0;
const DEFAULT_EXP_MAX = 21;

const Resumes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const {
    loading,
    filters,
    tempSelections,
    setTempSelections,
    loading: loadingSidebar,
    handleApply,
  } = useSideFilters();

  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  console.log('[DEBUG] setTempSelections:', setTempSelections, typeof setTempSelections);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasMin = params.has('expMin');
    const hasMax = params.has('expMax');
    if (!hasMin || !hasMax) {
      params.set('expMin', DEFAULT_EXP_MIN);
      params.set('expMax', DEFAULT_EXP_MAX);
      setRedirecting(true);
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    } else {
      setRedirecting(false);
    }
  }, [location, navigate]);

  useEffect(() => {
    console.log('[DEBUG] filters:', filters);
    console.log('[DEBUG] tempSelections:', tempSelections);
  }, [filters, tempSelections]);

  if (redirecting) return null;

  return (
    <div className='bg-background min-h-screen'>
      <NavBar />
      <div className='relative flex transition-all duration-300 px-14 py-8 gap-4'>
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
        <div className={`${sidebarOpen ? 'w-[25%]' : 'w-0'} transition-all duration-300`}>
          <div
            className={`sticky top-[100px] h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden pr-2 scrollbar-custom`}
          >
            {sidebarOpen && (
              <>
                {loading ? (
                  <div className='text-center text-gray-500'>Loading filters...</div>
                ) : (
                  <SideFilters onClose={() => setSidebarOpen(false)} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Resume Layout */}
        <div className={`${sidebarOpen ? 'w-[75%]' : 'w-full'} transition-all duration-300`}>
          <ResumesLayout />
        </div>
        {/* Job Description Input */}
        <JobDescriptionInput
          visible={sidebarOpen}
          sidebarOpen={sidebarOpen}
          filters={filters}
          setTempSelections={setTempSelections}
          isLoadingSidebar={loading}
          handleApply={handleApply}
          tempSelections={tempSelections} 
        />
      </div>
    </div>
  );
};

export default Resumes;
