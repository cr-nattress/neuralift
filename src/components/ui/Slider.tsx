'use client';

import { forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  showValue?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      min,
      max,
      step = 1,
      onChange,
      formatValue,
      showValue = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
      },
      [onChange]
    );

    const percentage = ((value - min) / (max - min)) * 100;
    const displayValue = formatValue ? formatValue(value) : value.toString();

    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="relative flex-1">
          <input
            ref={ref}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'w-full h-2 rounded-full appearance-none cursor-pointer',
              'bg-surface-hover',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
              disabled && 'opacity-50 cursor-not-allowed',
              // Thumb styling
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-accent-cyan',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-webkit-slider-thumb]:shadow-glow-cyan',
              // Firefox thumb
              '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-accent-cyan',
              '[&::-moz-range-thumb]:border-none',
              '[&::-moz-range-thumb]:cursor-pointer'
            )}
            style={{
              background: `linear-gradient(to right, var(--accent-cyan) 0%, var(--accent-cyan) ${percentage}%, var(--surface-hover) ${percentage}%, var(--surface-hover) 100%)`,
            }}
            {...props}
          />
        </div>
        {showValue && (
          <span className="min-w-[4rem] text-right text-sm font-mono text-text-primary">
            {displayValue}
          </span>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
