const RangeInput = ({ id, label, value, min, max, onChange, unit = 'yrs', className = '' }) => {
  return (
    <div className={`flex-1 ${className}`}>
      <label
        htmlFor={id}
        className='block text-sm text-gray-500 mb-1'
      >
        {label}
      </label>
      <div className='relative'>
        <input
          id={id}
          type='number'
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className={`w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:border-primary outline-none ${
            (id === 'min-experience' && value > min) || (id === 'max-experience' && value < max)
              ? 'border-primary'
              : ''
          } `}
        />
        {unit && <span className='absolute right-3 top-2 text-gray-500'>{unit}</span>}
      </div>
    </div>
  );
};

export default RangeInput;
