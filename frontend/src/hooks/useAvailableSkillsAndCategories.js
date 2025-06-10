import { useMemo } from 'react';
import { normalize } from '@/utils/resumeUtils';

export function useAvailableSkillsAndCategories(resumes) {
  return useMemo(() => {
    const seenSkills = {};
    const seenCategories = {};
    resumes.forEach(r => {
      (r.skills || []).forEach(s => (seenSkills[normalize(s.name)] = s.name));
      (r.categories || []).forEach(c => (seenCategories[normalize(c.name)] = c.name));
    });
    return {
      availableSkills: Object.entries(seenSkills).map(([id, label]) => ({ id, label })),
      availableCategories: Object.entries(seenCategories).map(([id, label]) => ({ id, label })),
    };
  }, [resumes]);
}
