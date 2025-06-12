import React from 'react';

const PrimaryButton = ({ children, onClick, disabled, className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-full font-semibold transition ${
      disabled ? 'bg-gray-400 text-white' : 'bg-primary text-white cursor-pointer hover:shadow-lg'
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
