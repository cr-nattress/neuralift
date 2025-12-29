'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg-primary focus-visible:ring-accent-cyan',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent-cyan text-bg-primary',
          'hover:bg-accent-cyan-muted',
          'active:scale-[0.98]',
          'shadow-glow-cyan',
        ],
        secondary: [
          'bg-surface-subtle text-text-primary',
          'border border-border-default',
          'hover:bg-surface-hover hover:border-border-hover',
          'active:bg-surface-active',
        ],
        ghost: [
          'bg-transparent text-text-secondary',
          'hover:bg-surface-subtle hover:text-text-primary',
          'active:bg-surface-hover',
        ],
        danger: [
          'bg-error text-white',
          'hover:bg-error-muted',
          'active:scale-[0.98]',
        ],
      },
      size: {
        sm: 'h-9 px-3 text-sm rounded-lg',
        md: 'h-11 px-5 text-base rounded-xl',
        lg: 'h-14 px-8 text-lg rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
