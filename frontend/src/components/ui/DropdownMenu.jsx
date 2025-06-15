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
      className={`fixed inset-0 z-[${zIndex}]`}
      role='presentation'
      aria-hidden='true'
      style={{ background: 'transparent', pointerEvents: 'auto' }}
      onClick={onClick}
      // onWheel={e => e.preventDefault()}
      onTouchMove={e => e.preventDefault()}
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
  const ref = useRef();

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
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

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

  return (
    <div
      className='relative inline-block text-left'
      ref={ref}
    >
      {triggerElement}
      {show && (
        <>
          <DropdownOverlay
            onClick={() => setOpen(false)}
            zIndex={zIndex - 1}
          />
          <div
            className={`
              absolute ${
                align === 'right' ? 'right-0' : 'left-0'
              } mt-2 origin-top-${align} bg-white rounded-xl shadow-lg z-[${zIndex}] flex flex-col
              transition-all duration-200 ease-out
              ${
                dropdownVisible
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-90 pointer-events-none'
              }
              ${width}
            `}
            style={{
              transformOrigin: `top ${align}`,
              minWidth: align === 'right' ? '160px' : undefined,
              maxWidth: '220px',
              overflowY: 'auto',
            }}
            tabIndex={-1}
            role='menu'
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
                  ${idx === 0 ? 'rounded-t-xl' : ''} ${
                  idx === options.length - 1 ? 'rounded-b-xl' : ''
                }
                  hover:bg-gray-100 transition cursor-pointer
                `}
                onClick={() => {
                  opt.onClick?.();
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlighted(idx)}
                tabIndex={-1}
              >
                {opt.icon && <span className='mr-2'>{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;
