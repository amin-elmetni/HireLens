import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Utility to group options by group label
function groupBy(options, getGroup) {
  return options.reduce((acc, option) => {
    const group = getGroup(option) || 'Default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {});
}

// Overlay always closes dropdown
function DropdownOverlay({ onClick }) {
  useEffect(() => {
    const prevent = e => {
      e.preventDefault();
    };
    // Prevent scroll events (mouse and touch)
    document.addEventListener('wheel', prevent, { passive: false });
    document.addEventListener('touchmove', prevent, { passive: false });
    document.addEventListener('scroll', prevent, { passive: false });

    return () => {
      document.removeEventListener('wheel', prevent, { passive: false });
      document.removeEventListener('touchmove', prevent, { passive: false });
      document.removeEventListener('scroll', prevent, { passive: false });
    };
  }, []);

  return createPortal(
    <div
      className='fixed inset-0 z-[2000]'
      role='presentation'
      // inert
      aria-hidden='true'
      style={{ background: 'transparent', pointerEvents: 'auto' }}
      onClick={onClick}
      // onWheel={e => e.preventDefault()}
      onTouchMove={e => e.preventDefault()}
    />,
    document.body
  );
}

const SortDropdown = ({
  options,
  value,
  onChange,
  getGroup = () => 'Default', // function to group options
  groupOrder, // array of group labels to order columns
  showLabels = true,
  placeholder = 'Select...',
  buttonClassName = '',
  dropdownClassName = '',
  zIndex = 10000,
}) => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef();

  // Grouping
  const grouped = groupBy(options, getGroup);
  const groups = groupOrder || Object.keys(grouped);
  // Flatten all options (for keyboard navigation)
  const flatOptions = groups.flatMap(g => grouped[g] || []);
  const selected = options.find(opt => opt.value === value);

  // Animation
  useEffect(() => {
    if (open) {
      setShow(true);
      let raf1 = requestAnimationFrame(() => {
        let raf2 = requestAnimationFrame(() => {
          setDropdownVisible(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    } else if (show) {
      setDropdownVisible(false);
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setHighlighted(h => (h + 1) % flatOptions.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setHighlighted(h => (h - 1 + flatOptions.length) % flatOptions.length);
      } else if (e.key === 'Enter') {
        if (highlighted >= 0 && highlighted < flatOptions.length) {
          onChange(flatOptions[highlighted].value);
          setOpen(false);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, highlighted, flatOptions, onChange]);

  // Render column for a group
  const renderGroupCol = (label, group, startIndex) => {
    if (!group.length) return null;
    return (
      <div
        className='min-w-56 max-w-xs'
        key={label}
      >
        {showLabels && (
          <div className='px-4 pt-4 pb-2 text-xs font-bold text-gray-400 select-none cursor-default uppercase tracking-wider'>
            {label}
          </div>
        )}
        <ul role='group'>
          {group.map((opt, idx) => {
            const flatIdx = startIndex + idx;
            return (
              <li
                key={opt.value}
                role='option'
                aria-selected={opt.value === value}
                className={`group flex items-center w-full px-4 py-3 text-sm cursor-pointer whitespace-nowrap ${
                  flatIdx === highlighted ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } ${opt.value === value ? 'font-semibold bg-primary/5 text-gray-900' : ''}`}
                onMouseEnter={() => setHighlighted(flatIdx)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
                {opt.value === value && <span className='ml-auto text-primary'>✓</span>}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Compute start indices for groups
  let startIndex = 0;
  const groupStartIndices = {};
  groups.forEach(g => {
    groupStartIndices[g] = startIndex;
    startIndex += (grouped[g] || []).length;
  });

  // Dynamic columns
  const colCount = groups.filter(g => (grouped[g] || []).length > 0).length;

  return (
    <div
      className='relative inline-block text-left'
      ref={ref}
    >
      <button
        type='button'
        className={`flex items-center gap-2 pl-1 pr-4 py-2 font-semibold text-gray-700 focus:outline-none cursor-pointer ${buttonClassName}`}
        onClick={() => {
          setOpen(o => !o);
          setHighlighted(flatOptions.findIndex(opt => opt.value === value));
        }}
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <FontAwesomeIcon
          icon='fa-solid fa-caret-down'
          className={`
            text-gray-400
            transition-transform duration-200
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>
      {show && (
        <>
          <DropdownOverlay onClick={() => setOpen(false)} />
          <div
            className={`
              absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-opacity-5 z-[3000] flex
              transition-all duration-200 ease-out scrollbar-custom
              ${
                dropdownVisible
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-90 pointer-events-none'
              }
              ${dropdownClassName}
            `}
            style={{
              transformOrigin: 'top right',
              maxHeight: '21.75rem',
              minWidth: `${colCount * 14}rem`,
              overflowY: 'auto',
            }}
            tabIndex={-1}
            role='listbox'
          >
            {groups.map(g => renderGroupCol(g, grouped[g] || [], groupStartIndices[g]))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;
