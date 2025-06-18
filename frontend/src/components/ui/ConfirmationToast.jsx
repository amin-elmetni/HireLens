import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const ConfirmationToast = ({ message, show, duration = 2000, onClose, width = '20rem' }) => {
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef();

  // Handle the message, which could be a string, a function, or an object
  const getDisplayMessage = () => {
    if (typeof message === 'function') {
      return message();
    } else if (typeof message === 'object' && message !== null) {
      return message.message || '';
    } else {
      return message || '';
    }
  };

  const displayMessage = getDisplayMessage();

  // Whenever show becomes true, display the toast and set an auto-hide timer
  useEffect(() => {
    if (show && displayMessage) {
      setVisible(true);
      // Clear any previous timers
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      // Hide after duration
      hideTimeout.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    } else {
      setVisible(false);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    }
    // Cleanup on unmount
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [show, displayMessage, duration]);

  // Call parent's onClose when fully hidden (after fade out)
  useEffect(() => {
    if (!visible && show) {
      // Give time for fade out (matches transition duration)
      const transitionTimeout = setTimeout(() => {
        if (onClose) onClose();
      }, 300);
      return () => clearTimeout(transitionTimeout);
    }
  }, [visible, show, onClose]);

  // The toast content
  const toastContent = (
    <div
      aria-live='polite'
      aria-atomic='true'
      className={`fixed left-6 bottom-6 z-[9999] w-full min-h-[45px] px-4 flex items-center justify-center  
        bg-gray-800 text-white rounded-xl shadow-lg text-base transition-all duration-300
        ${
          visible
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none translate-y-4'
        }
      `}
      style={{
        fontFamily: 'inherit',
        letterSpacing: 0.1,
        maxWidth: width,
      }}
    >
      {displayMessage}
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default ConfirmationToast;
