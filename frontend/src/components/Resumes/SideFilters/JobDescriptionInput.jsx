import React, { useState, useRef, useEffect } from 'react';
import { extractSkillsAndCategories } from '@/api/textAnalysisApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const toId = label => label.toLowerCase().replace(/\s+/g, '_');

const JobDescriptionInput = ({
  visible,
  onExtract,
  filters,
  setTempSelections,
  isLoadingSidebar,
  sidebarOpen,
  handleApply,
  tempSelections, // <-- add this!
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  // Only allow input when filters are loaded
  const isFiltersReady = filters.skills.length > 0 && filters.categories.length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = 8 * 16;
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [input]);

  // Auto-apply when tempSelections updates and input is cleared (after submit)
  useEffect(() => {
    if (input === '' && handleApply) {
      handleApply();
    }
    // eslint-disable-next-line
  }, [tempSelections]);

  const matchItems = (items, matchedLabels, debugType) => {
    const matchedIds = matchedLabels.map(toId);
    const matched = items.filter(item => matchedIds.includes(item.id));
    console.log(
      `[DEBUG][${debugType}] matchedLabels:`,
      matchedLabels,
      '| matchedIds:',
      matchedIds,
      '| items:',
      items.map(i => i.id),
      '| matched:',
      matched.map(i => i.id)
    );
    return matched;
  };

  const handleSend = async () => {
    if (!input.trim() || !isFiltersReady) return;
    setLoading(true);
    try {
      console.log('[DEBUG] Sending job description:', input);
      const { skills = [], categories = [] } = await extractSkillsAndCategories(input);
      console.log('[DEBUG] API Response:', { skills, categories });
      if (!filters) {
        console.log('[DEBUG] No filters found!');
        return;
      }
      const matchedSkills = matchItems(filters.skills, skills, 'skills');
      const matchedCategories = matchItems(filters.categories, categories, 'categories');
      setTempSelections(prev => {
        const updated = {
          ...prev,
          skills: matchedSkills,
          categories: matchedCategories,
        };
        console.log('[DEBUG] setTempSelections:', updated);
        return updated;
      });
      onExtract && onExtract();
      setInput('');
      // handleApply will be called by useEffect after setTempSelections
    } catch (e) {
      console.log('[DEBUG] Error in handleSend:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 z-30 transition-all duration-300 text-center w-[74%] ml-[25%] px-14

        ${
          sidebarOpen
            ? 'opacity-100 -translate-y-10 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }
      `}
      style={{ maxWidth: '100vw' }}
    >
      <div className='bg-gray-100 rounded-4xl pr-4 pl-5 py-3 flex items-center gap-2 border border-primary hide-scrollbar shadow-[0_0_40px_6px_rgba(0,0,0,0.4)] w-full'>
        <textarea
          ref={textareaRef}
          className='flex-1 bg-transparent outline-none border-none resize-none text-base px-0 py-1 overflow-hidden'
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter a job description here...'
          disabled={loading || isLoadingSidebar || !isFiltersReady}
          style={{
            resize: 'none',
            maxHeight: '8em',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim() || !isFiltersReady}
          className='text-primary hover:bg-primary/10 rounded-full p-2 transition disabled:opacity-50 disabled:bg-transparent cursor-pointer disabled:cursor-auto'
          title='Extract requirements'
        >
          {loading ? (
            <div className='w-5 h-5 relative'>
              <div className='absolute w-full h-full border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
              <div className='absolute w-full h-full border-2 border-primary/50 border-t-transparent rounded-full animate-spin-slow'></div>
            </div>
          ) : (
            <FontAwesomeIcon
              icon='fa-solid fa-magnifying-glass'
              className='text-xl'
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
