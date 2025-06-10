export const normalize = s => s?.toLowerCase().replace(/\s+/g, '_') ?? '';

export const getSortValue = (resume, sortBy) => {
  if (sortBy.startsWith('skill:')) {
    const skillId = sortBy.replace('skill:', '');
    return (resume.skills || []).find(s => normalize(s.name) === skillId)?.score ?? -Infinity;
  }
  if (sortBy.startsWith('category:')) {
    const categoryId = sortBy.replace('category:', '');
    return (
      (resume.categories || []).find(c => normalize(c.name) === categoryId)?.score ?? -Infinity
    );
  }
  switch (sortBy) {
    case 'matchingScore':
      return resume._matchingScore ?? 0;
    case 'lastUpdated':
      return Date.parse(resume.lastUpdated) || 0;
    case 'likes':
      return resume._likes ?? 0;
    case 'comments':
      return resume._comments ?? 0;
    case 'yearsOfExperience':
      return resume.yearsOfExperience ?? 0;
    case 'numExperiences':
      return (resume.experiences || []).length;
    case 'numProjects':
      return (resume.projects || []).length;
    default:
      return 0;
  }
};

export const BASE_SORT_OPTIONS = [
  { value: 'matchingScore', label: 'Matching Score' },
  { value: 'lastUpdated', label: 'Last Updated' },
  { value: 'likes', label: 'Number of Likes' },
  { value: 'comments', label: 'Number of Comments' },
  { value: 'yearsOfExperience', label: 'Years of Experience' },
  { value: 'numExperiences', label: 'Number of Experiences' },
  { value: 'numProjects', label: 'Number of Projects' },
];

export const getDynamicSortOptions = (
  availableSkills,
  availableCategories,
  selectedSkills,
  selectedCategories
) => [
  ...availableSkills
    .filter(s => selectedSkills.includes(s.id))
    .map(s => ({ value: `skill:${s.id}`, label: `${s.label}` })),
  ...availableCategories
    .filter(c => selectedCategories.includes(c.id))
    .map(c => ({ value: `category:${c.id}`, label: `${c.label}` })),
];
