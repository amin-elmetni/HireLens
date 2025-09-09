import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ChevronDown } from 'lucide-react';
import RangeInput from '@/components/Resumes/SideFilters/RangeInput';
import { motion, AnimatePresence } from 'framer-motion'; // Add this

const ExperienceRangeFilter = ({
  isExpanded,
  toggleExpand,
  range,
  onRangeChange,
  onMinChange,
  onMaxChange,
  min,
  max,
}) => {
  return (
    <div className='mb-4'>
      <div
        className='flex items-center justify-between mb-4 cursor-pointer'
        onClick={toggleExpand}
      >
        <h2 className='text-lg font-semibold truncate'>Years of Experience</h2>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className='mt-3 mb-4 px-1'>
              <Slider
                className='text-primary bg-gray-200 rounded-full'
                value={range}
                onValueChange={onRangeChange}
                min={min}
                max={max}
                step={1}
                minStepsBetweenThumbs={1}
              />
            </div>

            <div className='flex justify-between items-center gap-4'>
              <RangeInput
                id='min-experience'
                label='Min'
                value={range[0]}
                min={min}
                max={range[1]}
                onChange={onMinChange}
              />
              <RangeInput
                id='max-experience'
                label='Max'
                value={range[1]}
                min={range[0]}
                max={max}
                onChange={onMaxChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceRangeFilter;
