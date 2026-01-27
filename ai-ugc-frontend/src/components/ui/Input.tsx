import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#94a3b8]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-white placeholder-[#64748b] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
            error
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
              : 'border-[#2d2d4a] hover:border-[#3d3d5a]',
            className
          )}
          {...props}
        />
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

Input.displayName = 'Input';
