import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResumeMetadata } from './useResumeMetadata';

export const useSideFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { metadata, loading } = useResumeMetadata();

  const [filters, setFilters] = useState(null);
  const [tempSelections, setTempSelections] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!metadata || initialized.current) return;

    const { minExperience, maxExperience } = metadata;

    const parseArray = key => searchParams.get(key)?.split(',') || [];
    const selectedCategories = parseArray('categories');
    const selectedSkills = parseArray('skills');
    const selectedLanguages = parseArray('languages');
    const expMin = searchParams.has('expMin') ? parseInt(searchParams.get('expMin')) : null;
    const expMax = searchParams.has('expMax') ? parseInt(searchParams.get('expMax')) : null;

    const hydrateChecked = (items, selected) =>
      items.map(item => {
        const label = typeof item === 'string' ? item : item.label;
        const count = typeof item === 'object' && item.count ? item.count : 0;
        const id = label.toLowerCase().replace(/\s+/g, '_');
        return {
          id,
          label,
          count,
          checked: selected.includes(id),
        };
      });

    const newFilters = {
      categories: hydrateChecked(metadata.categories, selectedCategories),
      skills: hydrateChecked(metadata.skills, selectedSkills),
      languages: hydrateChecked(metadata.languages, selectedLanguages),
      experienceRange: [expMin ?? minExperience, expMax ?? maxExperience],
    };

    const newTempSelections = {
      categories: newFilters.categories.filter(i => i.checked),
      skills: newFilters.skills.filter(i => i.checked),
      languages: newFilters.languages.filter(i => i.checked),
    };

    setFilters(newFilters);
    setTempSelections(newTempSelections);
    initialized.current = true;
  }, [metadata, searchParams]);

  useEffect(() => {
    if (!filters || !initialized.current) return;
    updateURL(filters);
  }, [filters]);

  const updateURL = filters => {
    const getCheckedIds = list => list.filter(i => i.checked).map(i => i.id);
    const categories = getCheckedIds(filters.categories);
    const skills = getCheckedIds(filters.skills);
    const languages = getCheckedIds(filters.languages);

    // The `hasFilter` variable checks if any filter is applied so we only render resumes when there are active filters.
    // const hasFilter = categories.length || skills.length || languages.length;

    const params = {
      ...(categories.length && { categories: categories.join(',') }),
      ...(skills.length && { skills: skills.join(',') }),
      ...(languages.length && { languages: languages.join(',') }),
      ...{
        expMin: filters.experienceRange[0],
        expMax: filters.experienceRange[1],
      },
    };

    setSearchParams(params);
  };

  const toggleTempSelection = useCallback((type, item) => {
    setTempSelections(prev => ({
      ...prev,
      [type]: prev[type].some(s => s.id === item.id)
        ? prev[type].filter(s => s.id !== item.id)
        : [...prev[type], item],
    }));
  }, []);

  const applySelections = useCallback(
    type => {
      setFilters(prev => {
        const updated = {
          ...prev,
          [type]: prev[type].map(item => ({
            ...item,
            checked: tempSelections[type].some(s => s.id === item.id),
          })),
        };
        return updated;
      });
    },
    [tempSelections]
  );

  const handleExperienceChange = useCallback(range => {
    setFilters(prev => ({
      ...prev,
      experienceRange: range,
    }));
  }, []);

  const handleMinInputChange = useCallback(
    e => {
      const newMin = parseInt(e.target.value, 10);
      if (!isNaN(newMin) && metadata) {
        setFilters(prev => {
          const clampedMin = Math.max(
            metadata.minExperience,
            Math.min(newMin, prev.experienceRange[1] - 1)
          );
          return {
            ...prev,
            experienceRange: [clampedMin, prev.experienceRange[1]],
          };
        });
      }
    },
    [metadata]
  );

  const handleMaxInputChange = useCallback(
    e => {
      const newMax = parseInt(e.target.value, 10);
      if (!isNaN(newMax) && metadata) {
        setFilters(prev => {
          const clampedMax = Math.min(
            metadata.maxExperience,
            Math.max(newMax, prev.experienceRange[0] + 1)
          );
          return {
            ...prev,
            experienceRange: [prev.experienceRange[0], clampedMax],
          };
        });
      }
    },
    [metadata]
  );

  const handleReset = useCallback(() => {
    if (!metadata) return;
    const reset = items =>
      items.map(item => {
        const label = typeof item === 'string' ? item : item.label;
        const count = typeof item === 'object' && item.count ? item.count : 0;
        return {
          id: label.toLowerCase().replace(/\s+/g, '_'),
          label,
          count,
          checked: false,
        };
      });

    const resetFilters = {
      categories: reset(metadata.categories),
      skills: reset(metadata.skills),
      languages: reset(metadata.languages),
      experienceRange: [metadata.minExperience, metadata.maxExperience],
    };
    setFilters(resetFilters);
    setTempSelections({
      categories: [],
      skills: [],
      languages: [],
    });
    setSearchParams({});
  }, [metadata]);

  const handleApply = useCallback(() => {
    setFilters(prev => {
      const updated = {
        ...prev,
        categories: prev.categories.map(item => ({
          ...item,
          checked: tempSelections.categories.some(sel => sel.id === item.id),
        })),
        skills: prev.skills.map(item => ({
          ...item,
          checked: tempSelections.skills.some(sel => sel.id === item.id),
        })),
        languages: prev.languages.map(item => ({
          ...item,
          checked: tempSelections.languages.some(sel => sel.id === item.id),
        })),
      };
      return updated;
    });
  }, [tempSelections]);

  return {
    filters,
    tempSelections,
    isExpanded,
    toggleExpand: () => setIsExpanded(prev => !prev),
    toggleTempSelection,
    applySelections,
    handleExperienceChange,
    handleMinInputChange,
    handleMaxInputChange,
    handleReset,
    handleApply,
    min: metadata?.minExperience ?? 0,
    max: metadata?.maxExperience ?? 20,
    loading,
  };
};
