import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BackCancelButton = ({
  onClick,
  icon = null,
  text = '',
  className = '',
  ariaLabel = '',
  size = 'md', // "md" | "lg"
  ...props
}) => {
  // Default styles for different sizes
  const baseClasses =
    size === 'lg'
      ? 'w-12 h-12 flex items-center justify-center justify-center'
      : 'px-4 py-2 flex items-center justify-center gap-3';

  return (
    <button
      className={`text-gray-900 hover:bg-gray-100 rounded-full font-semibold transition-colors cursor-pointer ${baseClasses} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || text}
      {...props}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          size={size === 'lg' ? 'lg' : '1x'}
        />
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default BackCancelButton;
