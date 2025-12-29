# Story 02-005: Create Card Component

## Story

**As a** developer
**I want** a reusable Card component
**So that** content containers are consistent with glass effect styling

## Points: 2

## Priority: Critical

## Status: TODO

## Description

Create a Card component with glassmorphism effect, supporting different variants and padding options.

## Acceptance Criteria

- [ ] Card component with glass effect
- [ ] Variants: default, elevated, interactive
- [ ] Configurable padding
- [ ] Border glow option
- [ ] CardHeader, CardContent, CardFooter sub-components

## Technical Details

### Card Component

```typescript
// src/components/ui/Card.tsx
'use client';

import { forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  [
    'rounded-2xl border',
    'backdrop-blur-sm',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-bg-glass',
          'border-border-subtle',
        ],
        elevated: [
          'bg-bg-elevated/80',
          'border-border-default',
          'shadow-lg',
        ],
        interactive: [
          'bg-bg-glass',
          'border-border-subtle',
          'hover:bg-surface-subtle',
          'hover:border-border-hover',
          'cursor-pointer',
        ],
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      glow: {
        none: '',
        cyan: 'shadow-glow-cyan',
        magenta: 'shadow-glow-magenta',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      glow: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, glow, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, glow, className }))}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

// Sub-components
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold text-xl text-text-primary', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-border-subtle', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { cardVariants };
```

### Usage Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Session Complete</CardTitle>
    <CardDescription>Great work!</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your accuracy: 85%</p>
  </CardContent>
</Card>

// Interactive card with glow
<Card variant="interactive" glow="cyan">
  <CardContent>
    <h3>Position 1-Back</h3>
    <p>Foundation level</p>
  </CardContent>
</Card>

// Elevated card
<Card variant="elevated" padding="lg">
  <CardContent>Premium content</CardContent>
</Card>
```

## Tasks

- [ ] Create src/components/ui/Card.tsx
- [ ] Implement Card with variants
- [ ] Create CardHeader, CardTitle, CardDescription
- [ ] Create CardContent, CardFooter
- [ ] Test glass effect renders correctly
- [ ] Test glow shadows
- [ ] Export from components index

## Dependencies

- Story 02-003 (Tailwind Config)

## Notes

- backdrop-blur-sm creates the frosted glass effect
- bg-bg-glass uses rgba for transparency
