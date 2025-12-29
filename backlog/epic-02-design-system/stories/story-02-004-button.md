# Story 02-004: Create Button Component

## Story

**As a** developer
**I want** a reusable Button component with variants
**So that** all buttons are consistent throughout the app

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Create a Button component using class-variance-authority (CVA) for variant management. Support primary, secondary, ghost, and danger variants with multiple sizes.

## Acceptance Criteria

- [ ] Button component created with CVA
- [ ] Four variants: primary, secondary, ghost, danger
- [ ] Three sizes: sm, md, lg
- [ ] Loading state with spinner
- [ ] Icon support (left and right)
- [ ] Full accessibility (focus states, disabled)
- [ ] Keyboard interaction works

## Technical Details

### Button Component

```typescript
// src/components/ui/Button.tsx
'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
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
          <Loader2 className="h-4 w-4 animate-spin" />
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
```

### Usage Examples

```tsx
// Primary button
<Button>Start Training</Button>

// Secondary with icon
<Button variant="secondary" leftIcon={<ArrowLeft />}>
  Back
</Button>

// Loading state
<Button isLoading>Saving...</Button>

// Full width
<Button fullWidth size="lg">
  Begin Session
</Button>
```

## Tasks

- [ ] Create src/components/ui/Button.tsx
- [ ] Install class-variance-authority if not present
- [ ] Define all variants and sizes
- [ ] Add loading state with spinner
- [ ] Add icon support
- [ ] Add focus and hover styles
- [ ] Test keyboard accessibility
- [ ] Export from components index

## Dependencies

- Story 02-003 (Tailwind Config)

## Notes

- CVA provides type-safe variant management
- forwardRef allows Button to work with forms and refs
- Always include focus-visible for keyboard users
