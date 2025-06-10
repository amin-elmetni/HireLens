import { useMemo } from 'react';
import { getSortValue } from '@/utils/resumeUtils';

export function useSortedResumes(processedResumes, sortBy) {
  return useMemo(
    () => [...processedResumes].sort((a, b) => getSortValue(b, sortBy) - getSortValue(a, sortBy)),
    [processedResumes, sortBy]
  );
}
