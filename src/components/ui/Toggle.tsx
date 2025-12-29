'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, onChange, disabled, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          'relative inline-flex items-center cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'w-11 h-6 rounded-full',
            'bg-surface-hover border border-border-default',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-accent-cyan peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-primary',
            'peer-checked:bg-accent-cyan peer-checked:border-accent-cyan',
            'transition-all duration-200',
            'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
            'after:bg-text-primary after:rounded-full after:h-5 after:w-5',
            'after:transition-all after:duration-200',
            'peer-checked:after:translate-x-5',
            'peer-checked:after:bg-bg-primary'
          )}
        />
        {label && (
          <span className="ml-3 text-sm text-text-primary">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
