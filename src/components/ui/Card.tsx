// src/components/ui/Card.tsx
'use client';

import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader: React.FC<CardHeaderProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const CardTitle: React.FC<CardTitleProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <h3
      className={`text-xl font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <p className={`mt-1 text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
};

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CardContent: React.FC<CardContentProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
