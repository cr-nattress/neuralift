# Story 02-006: Create ProgressBar Component

## Story

**As a** developer
**I want** a reusable ProgressBar component
**So that** progress indicators are consistent throughout the app

## Points: 2

## Priority: High

## Status: TODO

## Description

Create a ProgressBar component using Radix UI Progress primitive with custom styling and animation support.

## Acceptance Criteria

- [ ] ProgressBar component with Radix UI base
- [ ] Animated fill on value change
- [ ] Custom colors via prop
- [ ] Size variants
- [ ] Optional percentage label
- [ ] Accessible with ARIA attributes

## Technical Details

### ProgressBar Component

```typescript
// src/components/ui/ProgressBar.tsx
'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressVariants = cva(
  'relative overflow-hidden rounded-full bg-surface-subtle',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const indicatorVariants = cva(
  'h-full rounded-full transition-all duration-500 ease-out',
  {
    variants: {
      color: {
        cyan: 'bg-accent-cyan shadow-glow-cyan',
        magenta: 'bg-accent-magenta shadow-glow-magenta',
        gold: 'bg-accent-gold',
        success: 'bg-success',
        error: 'bg-error',
      },
    },
    defaultVariants: {
      color: 'cyan',
    },
  }
);

export interface ProgressBarProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'right';
}

export function ProgressBar({
  className,
  size,
  color,
  value,
  max = 100,
  showLabel = false,
  labelPosition = 'right',
  ...props
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        labelPosition === 'top' && 'flex-col items-stretch gap-1'
      )}
    >
      {showLabel && labelPosition === 'top' && (
        <span className="text-xs text-text-secondary text-right">
          {percentage}%
        </span>
      )}
      <ProgressPrimitive.Root
        className={cn(progressVariants({ size, className }), 'flex-1')}
        value={value}
        max={max}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(indicatorVariants({ color }))}
          style={{ width: `${percentage}%` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && labelPosition === 'right' && (
        <span className="text-sm text-text-secondary min-w-[3ch]">
          {percentage}%
        </span>
      )}
    </div>
  );
}
```

### Usage Examples

```tsx
// Basic progress
<ProgressBar value={75} />

// With label
<ProgressBar value={45} max={100} showLabel />

// Different colors and sizes
<ProgressBar value={80} color="success" size="lg" />
<ProgressBar value={30} color="error" size="sm" />

// Session progress
<ProgressBar
  value={currentTrial}
  max={totalTrials}
  showLabel
  labelPosition="top"
/>
```

## Tasks

- [ ] Create src/components/ui/ProgressBar.tsx
- [ ] Install @radix-ui/react-progress if needed
- [ ] Implement size variants
- [ ] Implement color variants
- [ ] Add label options
- [ ] Add smooth transition animation
- [ ] Test accessibility attributes
- [ ] Export from components index

## Dependencies

- Story 02-003 (Tailwind Config)

## Notes

- Uses Radix Progress for accessibility
- Glow effect on indicator for visual appeal
- transition-all duration-500 for smooth fills
