import React, { useState, useRef, useEffect, cloneElement } from 'react';
import { createPortal } from 'react-dom';

// Overlay closes dropdown and prevents scroll
function DropdownOverlay({ onClick, zIndex = 2000 }) {
  useEffect(() => {
    const prevent = e => e.preventDefault();
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
      className='fixed inset-0'
      style={{ background: 'transparent', pointerEvents: 'auto', zIndex }}
      role='presentation'
      aria-hidden='true'
      onClick={onClick}
    />,
    document.body
  );
}

// DropdownMenu for ellipsis menus
const DropdownMenu = ({
  options,
  trigger,
  zIndex = 3000,
  align = 'right', // 'left' or 'right'
  width = 'w-44', // tailwind width class
}) => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [direction, setDirection] = useState('down'); // down or up
  const ref = useRef();
  const menuRef = useRef();

  // Animation logic
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
        setHighlighted(h => (h + 1) % options.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setHighlighted(h => (h - 1 + options.length) % options.length);
      } else if (e.key === 'Enter') {
        if (highlighted >= 0 && highlighted < options.length) {
          options[highlighted].onClick?.();
          setOpen(false);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, highlighted, options]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = e => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Direction detection (open up if not enough space below)
  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      if (!ref.current || !menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      const triggerRect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (triggerRect.bottom + rect.height > windowHeight - 35) {
        setDirection('up');
      } else {
        setDirection('down');
      }
    }, 10);
  }, [open, show, options.length, width]);

  // Custom trigger (required)
  const triggerElement = cloneElement(trigger, {
    onClick: e => {
      e.stopPropagation();
      setOpen(o => !o);
      setHighlighted(-1);
      trigger.props.onClick?.(e);
    },
    'aria-haspopup': 'menu',
    'aria-expanded': open,
  });

  // Create menu portal to ensure it's at the top level of the DOM
  const menuElement =
    show &&
    createPortal(
      <>
        {/* Overlay first */}
        <DropdownOverlay
          onClick={() => setOpen(false)}
          zIndex={zIndex}
        />
        {/* Dropdown menu always above overlay */}
        <div
          ref={menuRef}
          className={`
            fixed bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.25)] py-2 flex flex-col
            transition-all duration-200 ease-out
            ${
              dropdownVisible
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-90 pointer-events-none'
            }
            ${width}
          `}
          style={{
            zIndex: zIndex + 10, // Ensure menu is above overlay
            transformOrigin: direction === 'down' ? `top ${align}` : `bottom ${align}`,
            minWidth: align === 'right' ? '160px' : undefined,
            overflowY: 'auto',
            // Position the menu relative to the trigger
            ...(() => {
              if (!ref.current) return {};
              const rect = ref.current.getBoundingClientRect();
              return {
                [align === 'right' ? 'right' : 'left']:
                  align === 'right' ? window.innerWidth - rect.right : rect.left,
                ...(direction === 'down'
                  ? { top: rect.bottom + 8 }
                  : { bottom: window.innerHeight - rect.top + 8 }),
              };
            })(),
          }}
          tabIndex={-1}
          role='menu'
          onClick={e => e.stopPropagation()}
        >
          {options.map((opt, idx) => (
            <button
              key={opt.value}
              role='menuitem'
              aria-selected={false}
              className={`
                flex items-center w-full px-4 py-3 text-left text-sm whitespace-nowrap
                ${idx === highlighted ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                ${opt.destructive ? 'text-red-600' : ''}
                hover:bg-gray-100 transition cursor-pointer font-medium
              `}
              onClick={e => {
                e.stopPropagation();
                opt.onClick?.(e);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlighted(idx)}
              tabIndex={-1}
              type='button'
            >
              {opt.icon && <span className='mr-4 text-[18px]'>{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      </>,
      document.body
    );

  return (
    <div
      className='relative inline-block text-left'
      ref={ref}
    >
      {triggerElement}
      {menuElement}
    </div>
  );
};

export default DropdownMenu;
