import { useMemo } from 'react';
import { formatDate } from '@/utils/formatDate';

const normalize = s => s.toLowerCase().replace(/\s+/g, '_');

export const useResumeMetrics = (resume, searchParams) => {
  const { categories = [], skills = [], lastUpdated, finalScore } = resume;

  const selectedSkillIds = useMemo(
    () => (searchParams.get('skills') || '').split(',').map(normalize),
    [searchParams]
  );

  const selectedCategoryIds = useMemo(
    () => (searchParams.get('categories') || '').split(',').map(normalize),
    [searchParams]
  );

  const selectedSkills = useMemo(
    () => skills.filter(skill => selectedSkillIds.includes(normalize(skill.name))),
    [skills, selectedSkillIds]
  );

  const selectedCategories = useMemo(
    () => categories.filter(cat => selectedCategoryIds.includes(normalize(cat.name))),
    [categories, selectedCategoryIds]
  );

  const topFiveSkills = useMemo(
    () => [...skills].sort((a, b) => b.score - a.score).slice(0, 5),
    [skills]
  );

  const topThreeSkills = useMemo(
    () => [...skills].sort((a, b) => b.score - a.score).slice(0, 3),
    [skills]
  );

  const topCategory = useMemo(() => {
    if (categories.length === 0) return 'Uncategorized';
    return categories.reduce((prev, curr) => (curr.score > prev.score ? curr : prev)).name;
  }, [categories]);

  const formattedDate = useMemo(() => formatDate(lastUpdated), [lastUpdated]);

  const matchingScore = useMemo(() => {
    const data =
      selectedSkills.length > 0
        ? selectedSkills
        : selectedCategories.length > 0
        ? selectedCategories
        : [];

    if (data.length > 0) {
      const total = data.reduce((sum, el) => sum + el.score, 0);
      return Math.round((total / data.length) * 100);
    }
    return Math.round((finalScore ?? 0) * 100);
  }, [selectedSkills, selectedCategories, finalScore]);

  const categoryScoringData = useMemo(() => {
    return selectedCategories.map(c => ({ ...c, type: 'category' }));
  }, [selectedCategories]);

  const skillScoringData = useMemo(() => {
    if (selectedSkills.length > 0) {
      return selectedSkills.map(s => ({ ...s, type: 'skill' }));
    }

    if (selectedCategories.length > 0) {
      return topThreeSkills.map(s => ({ ...s, type: 'skill' }));
    }

    return topFiveSkills.map(s => ({ ...s, type: 'skill' }));
  }, [selectedSkills, selectedCategories, topThreeSkills, topFiveSkills]);

  const skillsSectionTitle =
    selectedSkills.length > 0
      ? 'Matching Skills'
      : selectedCategories.length > 0
      ? 'Top Skills'
      : 'Top Skills';

  return {
    topCategory,
    formattedDate,
    matchingScore,
    categoryScoringData,
    skillScoringData,
    skillsSectionTitle,
  };
};
