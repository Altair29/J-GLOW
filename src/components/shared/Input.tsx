'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-400 focus:ring-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
