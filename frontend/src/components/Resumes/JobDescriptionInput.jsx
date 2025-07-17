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
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

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
    if (!input.trim()) return;
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
      // Call handleApply after updating selections
      setTimeout(() => {
        if (handleApply) {
          console.log('[DEBUG] Calling handleApply...');
          handleApply();
        } else {
          console.log('[DEBUG] No handleApply provided!');
        }
      }, 0);
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
        fixed z-30 bottom-10 right-20 left-135 transition-all duration-300 text-center
        ${
          sidebarOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }
      `}
    >
      <div className='bg-gray-100 rounded-full shadow-lg px-4 py-2 flex items-center gap-2 border border-primary hide-scrollbar'>
        <textarea
          ref={textareaRef}
          className='flex-1 bg-transparent outline-none border-none resize-none text-base px-0 py-1 overflow-hidden'
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter a job description here...'
          disabled={loading || isLoadingSidebar}
          style={{
            resize: 'none',
            maxHeight: '8em',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className='text-primary hover:bg-primary/10 rounded-full p-2 transition disabled:opacity-50'
          title='Extract requirements'
        >
          {loading ? (
            <span className='w-5 h-5 animate-spin border-2 border-primary border-t-transparent rounded-full' />
          ) : (
            <FontAwesomeIcon
              icon='paper-plane'
              className='text-xl'
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
