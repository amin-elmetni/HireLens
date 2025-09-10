import api from './aiIndex';

export const extractSkillsAndCategories = async text => {
  const res = await api.post('/text-analysis/extract', {
    text,
    return_skills: true,
    return_categories: true,
  });
  return res.data;
};
