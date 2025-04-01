// src/components/ui/Input.tsx
'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      // Extract all other valid input props
      ...props
    },
    ref
  ) => {
    // Create container classes separately (don't pass fullWidth to DOM)
    const containerClasses = `${fullWidth ? 'w-full' : ''}`;

    // Create input classes separately (don't pass custom props to DOM)
    const inputClasses = `
      block rounded-md shadow-sm h-12
      ${leftIcon ? 'pl-10' : 'pl-4'} 
      ${rightIcon ? 'pr-10' : 'pr-4'} 
      py-2 
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
