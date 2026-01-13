import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f0f23]';

    const variants = {
      primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25',
      secondary: 'bg-[#1a1a2e] text-white border border-[#2d2d4a] hover:bg-[#252540] hover:border-[#3d3d5a] focus:ring-purple-500',
      outline: 'border border-[#2d2d4a] text-[#94a3b8] hover:bg-[#1a1a2e] hover:text-white hover:border-[#3d3d5a] focus:ring-indigo-500',
      ghost: 'text-[#94a3b8] hover:bg-[#1a1a2e] hover:text-white focus:ring-indigo-500',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 spinner" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
