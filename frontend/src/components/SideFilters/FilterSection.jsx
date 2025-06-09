import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const FilterSection = ({ title, items, onToggle, itemType = 'cat' }) => {
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold'>{title}</h2>
        <ChevronDown className='h-5 w-5 text-gray-500' />
      </div>
      <div className='space-y-3'>
        {items.map(item => (
          <div
            key={item.id}
            className='flex items-center justify-between'
          >
            <div className='flex items-center space-x-3'>
              <Checkbox
                className='text-white border-gray-300 w-5 h-5'
                id={`${itemType}-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => onToggle(item.id)}
              />
              <label
                htmlFor={`${itemType}-${item.id}`}
                className='text-gray-900 text-sm'
              >
                {item.label}
              </label>
            </div>
            <span
              className={`text-gray-400 text-xs bg-gray-100 px-2 rounded-full font-semibold py-[1px] ${
                item.checked ? 'bg-primary/15 text-primary' : ''
              } `}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
