import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const ConfirmationToast = ({ message, show, duration = 2500, onClose, width = '20rem' }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  // The toast content
  const toastContent = (
    <div
      aria-live='polite'
      aria-atomic='true'
      className={`fixed left-6 bottom-6 z-[9999] w-full min-h-[45px] px-4 flex items-center justify-center  
        bg-gray-800 text-white rounded-xl shadow-lg text-base transition-all duration-300 
        ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-4'}
      `}
      style={{
        fontFamily: 'inherit',
        letterSpacing: 0.1,
        maxWidth: width,
      }}
    >
      {message}
    </div>
  );

  // Render the toast as a portal to document.body
  return createPortal(toastContent, document.body);
};

export default ConfirmationToast;
