import React, { useState, useMemo } from 'react';
import ResumeCard from '@/components/ResumeLayout/ResumeCard';
import SortDropdown from '@/components/ResumeLayout/SortDropdown';
import { useSearchParams } from 'react-router-dom';
import { useFilteredResumes } from '@/hooks/resumes/useFilteredResumes';
import { BASE_SORT_OPTIONS, getDynamicSortOptions } from '@/utils/resumeUtils';
import { useAvailableSkillsAndCategories } from '@/hooks/resumes/useAvailableSkillsAndCategories';
import { useResumeCounts } from '@/hooks/resumes/useResumeCounts';
import { useProcessedResumes } from '@/hooks/resumes/useProcessedResumes';
import { useSortedResumes } from '@/hooks/resumes/useSortedResumes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FILTER_KEYS = ['skills', 'categories', 'languages', 'expMin', 'expMax'];
const PAGE_SIZE = 12;

const ResumesLayout = () => {
  const { resumes, loading } = useFilteredResumes();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('matchingScore');
  const [currentPage, setCurrentPage] = useState(1);

  const selectedSkills = useMemo(
    () => (searchParams.get('skills') || '').split(',').filter(Boolean),
    [searchParams]
  );
  const selectedCategories = useMemo(
    () => (searchParams.get('categories') || '').split(',').filter(Boolean),
    [searchParams]
  );

  const { availableSkills, availableCategories } = useAvailableSkillsAndCategories(resumes);
  const dynamicSortOptions = getDynamicSortOptions(
    availableSkills,
    availableCategories,
    selectedSkills,
    selectedCategories
  );
  const sortOptions = [...BASE_SORT_OPTIONS, ...dynamicSortOptions];

  const hasFilters = FILTER_KEYS.some(key => searchParams.has(key));
  const resumeCounts = useResumeCounts(resumes);
  const processedResumes = useProcessedResumes(
    resumes,
    selectedSkills,
    selectedCategories,
    resumeCounts
  );
  const sortedResumes = useSortedResumes(processedResumes, sortBy);

  // Pagination calculations
  const totalResumes = sortedResumes.length;
  const totalPages = Math.ceil(totalResumes / PAGE_SIZE);
  const paginatedResumes = sortedResumes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to first page if sort or filters change
  useMemo(() => setCurrentPage(1), [sortBy, searchParams]);

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold text-gray-700'>
          {hasFilters ? sortedResumes.length : 0}{' '}
          <span className='text-gray-400 font-semibold'>Resumes Found</span>
        </h1>
        <h2 className='flex items-center gap-2 font-semibold text-gray-600'>
          <span className='text-gray-400'>Sort by :</span>
          <SortDropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </h2>
      </div>

      {loading ? (
        <div className='text-center text-gray-500'>Loading resumes...</div>
      ) : sortedResumes.length === 0 ? (
        <div className='text-center text-gray-500'>No resumes found.</div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
            {paginatedResumes.map(resume => (
              <ResumeCard
                key={resume.id}
                resume={resume}
              />
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-8 select-none'>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded transition font-medium cursor-pointer ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-primary hover:text-white text-primary'
                }`}
              >
                <FontAwesomeIcon icon='fa-solid fa-angle-left' />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded transition font-medium cursor-pointer ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-primary hover:text-white text-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded transition font-medium cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-primary hover:text-white text-primary'
                }`}
              >
                <FontAwesomeIcon icon='fa-solid fa-angle-right' />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResumesLayout;
