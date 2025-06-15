import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Same fade logic as the modal: syncs with modal's fadeIn state via prop
export default function ScrollLockOverlay({ open, onClick, fadeIn = true, lockScroll = true }) {
  const [visible, setVisible] = useState(open);

  // Handle mount/unmount with fade
  useEffect(() => {
    if (open) {
      setVisible(true);
      // Delay adding opacity for next tick (ensures transition)
    } else {
      // Wait for fade-out animation before unmount
      const timeout = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Prevent scroll, keep scrollbar visible

  useEffect(() => {
    if (!open || !lockScroll) return;
    const prevent = e => e.preventDefault();
    document.addEventListener('wheel', prevent, { passive: false });
    document.addEventListener('touchmove', prevent, { passive: false });
    document.addEventListener('scroll', prevent, { passive: false });
    return () => {
      document.removeEventListener('wheel', prevent, { passive: false });
      document.removeEventListener('touchmove', prevent, { passive: false });
      document.removeEventListener('scroll', prevent, { passive: false });
    };
  }, [open]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[1000]
        bg-black transition-opacity duration-200
        ${fadeIn ? 'opacity-50' : 'opacity-0'}
      `}
      tabIndex={-1}
      // inert
      aria-hidden='true'
      onClick={onClick}
      // onWheel={e => e.preventDefault()}
      onTouchMove={e => e.preventDefault()}
      style={{ pointerEvents: 'auto' }}
    />,
    document.body
  );
}
