import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#94a3b8]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-white appearance-none cursor-pointer transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
              error
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-[#2d2d4a] hover:border-[#3d3d5a]',
              className
            )}
            {...props}
          >
            <option value="" disabled>
              Select an option...
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[#64748b]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
