import { useMemo } from 'react';
import { getSortValue } from '@/utils/resumeUtils';

export function useSortedResumes(processedResumes, sortBy) {
  return useMemo(
    () => [...processedResumes].sort((a, b) => getSortValue(b, sortBy) - getSortValue(a, sortBy)),
    [processedResumes, sortBy]
  );
}
// form-checkbox appearance-none mr-3 h-[20px] w-[20px] border-2 border-gray-400 rounded-xs checked:bg-primary checked:border-primary relative after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1 after:w-[12px] after:h-[6px] after:border-l-2 after:border-b-2 after:border-white after:rotate-[-45deg] after:opacity-0 checked:after:opacity-100 cursor-pointer