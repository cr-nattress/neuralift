# Story 04-008: Create Training Grid Component

## Story

**As a** user
**I want** a clear visual grid
**So that** I can track position stimuli

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build the 3x3 training grid with animated cell activation, feedback states, and glow effects.

## Acceptance Criteria

- [ ] 3x3 grid renders correctly
- [ ] Active cell glows cyan
- [ ] Correct feedback shows green flash
- [ ] Incorrect feedback shows red shake
- [ ] Smooth transitions between states
- [ ] Responsive sizing
- [ ] Accessible with ARIA attributes

## Technical Details

```typescript
// src/components/training/Grid.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GridProps {
  activePosition: number | null;
  feedback?: { position: number; type: 'correct' | 'incorrect' } | null;
}

const GRID_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function Grid({ activePosition, feedback }: GridProps) {
  return (
    <div
      role="grid"
      aria-label="N-back memory grid"
      className="grid grid-cols-3 gap-2 sm:gap-3 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80"
    >
      {GRID_POSITIONS.map((position) => (
        <GridCell
          key={position}
          position={position}
          isActive={activePosition === position}
          feedback={feedback?.position === position ? feedback.type : null}
        />
      ))}
    </div>
  );
}

interface GridCellProps {
  position: number;
  isActive: boolean;
  feedback: 'correct' | 'incorrect' | null;
}

function GridCell({ position, isActive, feedback }: GridCellProps) {
  const positionNames = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  return (
    <motion.div
      role="gridcell"
      aria-label={`Position ${positionNames[position]}`}
      aria-selected={isActive}
      className={cn(
        'rounded-xl border-2 relative flex items-center justify-center',
        'transition-colors duration-150',
        {
          'bg-surface-subtle border-border-subtle': !isActive && !feedback,
          'bg-accent-cyan-glow border-accent-cyan shadow-glow-cyan': isActive,
          'bg-success-subtle border-success': feedback === 'correct',
          'bg-error-subtle border-error': feedback === 'incorrect',
        }
      )}
      animate={
        isActive
          ? { scale: [1, 1.03, 1], transition: { duration: 0.3 } }
          : feedback === 'incorrect'
          ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.3 } }
          : {}
      }
    >
      {isActive && (
        <motion.div
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent-cyan"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.div>
  );
}
```

## Tasks

- [ ] Create src/components/training/Grid.tsx
- [ ] Implement GridCell with states
- [ ] Add Framer Motion animations
- [ ] Add glow effect for active cell
- [ ] Add shake animation for incorrect
- [ ] Add ARIA attributes
- [ ] Make responsive
- [ ] Test with screen reader

## Dependencies

- Story 02-003 (Tailwind Config)
- Story 02-007 (Visual Effects)
