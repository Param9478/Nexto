// src/components/ui/DatePicker.tsx
'use client';

import React from 'react';
import { Input } from './Input';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  error,
  leftIcon,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="date"
      label={label}
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      error={error}
      leftIcon={leftIcon}
      disabled={disabled}
    />
  );
};
