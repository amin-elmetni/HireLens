import { useMemo } from 'react';
import { normalize } from '@/utils/resumeUtils';

export function useProcessedResumes(resumes, selectedSkills, selectedCategories, resumeCounts) {
  return useMemo(
    () =>
      resumes.map(resume => {
        const skills = resume.skills || [];
        const categories = resume.categories || [];
        const matchedSkills = skills.filter(s => selectedSkills.includes(normalize(s.name)));
        const matchedCategories = categories.filter(c =>
          selectedCategories.includes(normalize(c.name))
        );
        let score = 0;
        if (matchedSkills.length > 0)
          score = matchedSkills.reduce((sum, s) => sum + (s.score ?? 0), 0) / matchedSkills.length;
        else if (matchedCategories.length > 0)
          score =
            matchedCategories.reduce((sum, c) => sum + (c.score ?? 0), 0) /
            matchedCategories.length;
        else score = resume.finalScore ?? 0;
        const counts = resumeCounts[resume.uuid] || {};
        return {
          ...resume,
          _matchingScore: Math.round(score * 100),
          _likes: counts.likes ?? 0,
          _comments: counts.comments ?? 0,
        };
      }),
    [resumes, selectedSkills, selectedCategories, resumeCounts]
  );
}
