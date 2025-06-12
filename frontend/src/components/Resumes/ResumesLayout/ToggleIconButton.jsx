import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ToggleIconButton = ({
  onClick,
  isActive,
  regularIcon,
  solidIcon,
  activeColor,
  size = 'w-6 h-6',
  extraClasses = '',
}) => {
  return (
    <div
      className={`relative ${size} cursor-pointer group hover:scale-120 transition-transform duration-200 ${extraClasses}`}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={regularIcon}
        className={`absolute inset-0 ${
          isActive ? 'opacity-0' : 'text-gray-400'
        } group-hover:opacity-0 transition-opacity duration-200`}
      />
      <FontAwesomeIcon
        icon={solidIcon}
        className={`absolute inset-0 ${
          isActive ? 'opacity-100' : 'opacity-0'
        } ${activeColor} group-hover:opacity-100 transition-opacity duration-200`}
      />
    </div>
  );
};

export default ToggleIconButton;
