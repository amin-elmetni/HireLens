import React, { useEffect } from 'react';

const ConfirmationToast = ({ message, show, duration = 2500, onClose, width = '20rem' }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <div
      aria-live='polite'
      aria-atomic='true'
      className={`fixed left-6 bottom-6 z-[9999] w-full min-h-[50px] px-4 text-center flex items-center justify-center  
        bg-black text-white rounded-xl shadow-lg text-base transition-all duration-300 
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
};

export default ConfirmationToast;
