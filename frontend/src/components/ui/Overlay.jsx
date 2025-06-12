import React from 'react';
import { createPortal } from 'react-dom';

const Overlay = ({ open, onClick }) => {
  if (!open) return null;
  return createPortal(
    <div
      className='fixed inset-0 bg-black/50 z-[1000]'
      onClick={onClick}
      aria-label='Overlay'
    />,
    document.body
  );
};

export default Overlay;
