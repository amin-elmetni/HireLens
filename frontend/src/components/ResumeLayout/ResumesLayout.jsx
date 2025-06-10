import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResumeCard from '@/components/ResumeLayout/ResumeCard';
import { useFilteredResumes } from '@/hooks/useFilteredResumes';
import { getLikeCount, getResumeByUuid } from '@/api/likeApi';
import { getCommentCount } from '@/api/commentApi';

const normalize = s => s?.toLowerCase().replace(/\s+/g, '_') ?? '';

const BASE_SORT_OPTIONS = [
  { value: 'matchingScore', label: 'Matching Score' },
  { value: 'lastUpdated', label: 'Last Updated' },
  { value: 'likes', label: 'Number of Likes' },
  { value: 'comments', label: 'Number of Comments' },
  { value: 'yearsOfExperience', label: 'Years of Experience' },
  { value: 'numExperiences', label: 'Number of Experiences' },
  { value: 'numProjects', label: 'Number of Projects' },
];

// Dynamic sort options for selected skills/categories
const getDynamicSortOptions = (
  availableSkills,
  availableCategories,
  selectedSkills,
  selectedCategories
) => [
  ...availableSkills
    .filter(s => selectedSkills.includes(s.id))
    .map(s => ({ value: `skill:${s.id}`, label: `Skill: ${s.label}` })),
  ...availableCategories
    .filter(c => selectedCategories.includes(c.id))
    .map(c => ({ value: `category:${c.id}`, label: `Category: ${c.label}` })),
];

// How to extract the actual sort value for a given resume for a given sort key
const getSortValue = (resume, sortBy) => {
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

const ResumesLayout = () => {
  const { resumes, loading } = useFilteredResumes();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('matchingScore');

  // Like and comment counts state
  const [resumeCounts, setResumeCounts] = useState({}); // { [resumeUuid]: { likes: X, comments: Y } }

  // Get selected skills/categories
  const selectedSkills = (searchParams.get('skills') || '').split(',').filter(Boolean);
  const selectedCategories = (searchParams.get('categories') || '').split(',').filter(Boolean);

  // Collect available skills/categories from resumes for dropdown
  const availableSkills = useMemo(() => {
    const seen = {};
    resumes.forEach(r => (r.skills || []).forEach(s => (seen[normalize(s.name)] = s.name)));
    return Object.entries(seen).map(([id, label]) => ({ id, label }));
  }, [resumes]);
  const availableCategories = useMemo(() => {
    const seen = {};
    resumes.forEach(r => (r.categories || []).forEach(c => (seen[normalize(c.name)] = c.name)));
    return Object.entries(seen).map(([id, label]) => ({ id, label }));
  }, [resumes]);

  // Compose dynamic options
  const dynamicSortOptions = getDynamicSortOptions(
    availableSkills,
    availableCategories,
    selectedSkills,
    selectedCategories
  );
  const sortOptions = [...BASE_SORT_OPTIONS, ...dynamicSortOptions];

  const hasFilters = ['skills', 'categories', 'languages', 'expMin', 'expMax'].some(key =>
    searchParams.has(key)
  );

  // Fetch likes/comments for all resumes and store in state
  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      await Promise.all(
        resumes.map(async resume => {
          try {
            // get resumeId from uuid
            const { data: resumeMeta } = await getResumeByUuid(resume.uuid);
            if (!resumeMeta?.id) return;
            const [likesRes, commentsRes] = await Promise.all([
              getLikeCount(resumeMeta.id),
              getCommentCount(resumeMeta.id),
            ]);
            counts[resume.uuid] = {
              likes: likesRes.data ?? 0,
              comments: commentsRes.data ?? 0,
            };
          } catch (e) {
            counts[resume.uuid] = { likes: 0, comments: 0 };
          }
        })
      );
      setResumeCounts(counts);
    };

    if (resumes.length) fetchCounts();
  }, [resumes]);

  // Compute _matchingScore for all resumes (as before), and attach like/comment counts
  const processedResumes = useMemo(() => {
    return resumes.map(resume => {
      const skills = resume.skills || [];
      const categories = resume.categories || [];
      const matchedSkills = skills.filter(s => selectedSkills.includes(normalize(s.name)));
      const matchedCategories = categories.filter(c =>
        selectedCategories.includes(normalize(c.name))
      );

      let score = 0;
      if (matchedSkills.length > 0) {
        score = matchedSkills.reduce((sum, s) => sum + (s.score ?? 0), 0) / matchedSkills.length;
      } else if (matchedCategories.length > 0) {
        score =
          matchedCategories.reduce((sum, c) => sum + (c.score ?? 0), 0) / matchedCategories.length;
      } else {
        score = resume.finalScore ?? 0;
      }

      // Attach like/comment count if available
      const counts = resumeCounts[resume.uuid] || {};
      return {
        ...resume,
        _matchingScore: Math.round(score * 100),
        _likes: counts.likes ?? 0,
        _comments: counts.comments ?? 0,
      };
    });
  }, [resumes, selectedSkills, selectedCategories, resumeCounts]);

  // Sort resumes with selected sort
  const sortedResumes = useMemo(() => {
    return [...processedResumes].sort((a, b) => getSortValue(b, sortBy) - getSortValue(a, sortBy));
  }, [processedResumes, sortBy]);

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold'>
          {hasFilters ? sortedResumes.length : 0}{' '}
          <span className='font-light text-gray-400'>Resumes Found</span>
        </h1>
        <h2>
          <span className='text-gray-400'>Sort by :</span>
          <select
            className='border-none outline-none rounded py-1 font-semibold px-1 ml-2'
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </h2>
      </div>

      {!hasFilters ? (
        <div className='text-center text-gray-500 mt-10'>
          Please select at least one filter to view resumes.
        </div>
      ) : loading ? (
        <div className='text-center text-gray-500'>Loading resumes...</div>
      ) : sortedResumes.length === 0 ? (
        <div className='text-center text-gray-500'>No resumes found.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
          {sortedResumes.map(resume => (
            <ResumeCard
              key={resume.id}
              resume={resume}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesLayout;
