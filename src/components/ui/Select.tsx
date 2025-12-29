'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  onChange: (value: string | number) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, value, onChange, disabled, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            // Try to parse as number if it looks like one
            const numVal = Number(val);
            onChange(isNaN(numVal) ? val : numVal);
          }}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 pr-8 rounded-lg',
            'bg-surface-subtle border border-border-default',
            'text-text-primary text-sm',
            'appearance-none cursor-pointer',
            'hover:bg-surface-hover hover:border-border-hover',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
            'transition-all duration-200',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-bg-elevated text-text-primary"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
