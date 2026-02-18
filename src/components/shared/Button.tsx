'use client';

import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  themeColor?: string;
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, themeColor, className = '', style, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const computedStyle: CSSProperties = { ...style };

    let variantClasses = '';
    switch (variant) {
      case 'primary':
        if (themeColor) {
          computedStyle.backgroundColor = themeColor;
          computedStyle.color = '#ffffff';
          variantClasses = 'hover:opacity-90 focus:ring-blue-500';
        } else {
          variantClasses = 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500';
        }
        break;
      case 'secondary':
        variantClasses = 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400';
        break;
      case 'outline':
        variantClasses = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400';
        break;
      case 'ghost':
        variantClasses = 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400';
        break;
      case 'danger':
        variantClasses = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
        break;
    }

    return (
      <button
        ref={ref}
        className={`${base} ${sizeClasses[size]} ${variantClasses} ${className}`}
        style={computedStyle}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
