import React, { useState, useRef, useEffect } from 'react';
import { extractSkillsAndCategories } from '@/api/textAnalysisApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const JobDescriptionInput = ({
  visible,
  onExtract,
  filters,
  setTempSelections,
  isLoadingSidebar,
  sidebarOpen,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight, but not more than max height (8em)
      const maxHeight = 8 * 16; // Convert 8em to pixels (assuming 1em = 16px)
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [input]);

  // Helper to map backend match to current filter items
  const matchItems = (items, matchedLabels) =>
    items.filter(item => matchedLabels.includes(item.label.toLowerCase()));

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const { skills = [], categories = [] } = await extractSkillsAndCategories(input);
      setTempSelections(prev => ({
        ...prev,
        skills: matchItems(filters.skills, skills),
        categories: matchItems(filters.categories, categories),
      }));
      onExtract && onExtract();
      setInput('');
    } catch (e) {
      // Optionally show notification
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
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For IE
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
