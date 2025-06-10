import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SortDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef();

  // Animation: robust mount/unmount and transition
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
      const timeout = setTimeout(() => {
        setShow(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = e => {
      if (e.key === 'ArrowDown') {
        setHighlighted(h => (h + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        setHighlighted(h => (h - 1 + options.length) % options.length);
      } else if (e.key === 'Enter') {
        if (highlighted >= 0 && highlighted < options.length) {
          onChange(options[highlighted].value);
          setOpen(false);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, highlighted, options, onChange]);

  // Close on overlay click
  const handleOverlayClick = e => {
    // Only close if the overlay itself was clicked, not the dropdown
    if (e.target === e.currentTarget) setOpen(false);
  };

  const selected = options.find(opt => opt.value === value);

  return (
    <div
      className='relative inline-block text-left'
      ref={ref}
    >
      <button
        type='button'
        className='flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 focus:outline-none cursor-pointer'
        onClick={() => {
          setOpen(o => !o);
          setHighlighted(options.findIndex(opt => opt.value === value));
        }}
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        <span>{selected ? selected.label : 'Select sort'}</span>
        <FontAwesomeIcon
          icon='fa-solid fa-caret-down'
          className='text-gray-400'
        />
      </button>
      {show && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 z-20 cursor-default'
            aria-hidden='true'
            style={{ background: 'transparent' }}
            onClick={handleOverlayClick}
          />
          {/* Dropdown */}
          <ul
            className={`
              absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-opacity-5 z-30 divide-y divide-gray-100
              transition-all duration-200 ease-out scrollbar-custom
              ${
                dropdownVisible
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-90 pointer-events-none'
              }
            `}
            style={{ transformOrigin: 'top right', maxHeight: '19.75rem', overflowY: 'auto' }}
            tabIndex={-1}
            role='listbox'
          >
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role='option'
                aria-selected={opt.value === value}
                className={`group flex items-center w-full px-4 py-3 text-sm cursor-pointer ${
                  idx === highlighted ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } ${opt.value === value ? 'font-semibold bg-primary/5 text-gray-900' : ''}`}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
                {opt.value === value && <span className='ml-auto text-primary'>✓</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
