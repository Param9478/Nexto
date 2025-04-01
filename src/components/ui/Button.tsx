// src/components/ui/Button.tsx
'use client';

import React, { forwardRef } from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = 'md',
      variant = 'primary',
      isLoading = false,
      fullWidth = false,
      className = '',
      disabled,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-xs px-2.5 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    const variantClasses = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500',
      secondary:
        'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm focus:ring-gray-500',
      outline:
        'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost:
        'bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses = `
      inline-flex items-center justify-center rounded-md
      font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
      transition-colors duration-200
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${widthClasses}
      ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}
      ${className}
    `;

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
