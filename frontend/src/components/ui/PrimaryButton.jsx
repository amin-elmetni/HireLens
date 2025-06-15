import React from 'react';

const PrimaryButton = ({
  children,
  onClick,
  disabled,
  loading,
  className = '',
  bgcolor = 'bg-primary',
  ...props
}) => {
  const { loading: _loading, ...rest } = props;
  return (
    <button
      className={`px-4 py-2 rounded-full font-semibold transition ${
        disabled ? 'bg-gray-400 text-white' : `${bgcolor} text-white cursor-pointer hover:shadow-lg`
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className='inline-flex items-center gap-2'>
          <svg
            className='animate-spin h-4 w-4 mr-1 text-white'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
              fill='none'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
