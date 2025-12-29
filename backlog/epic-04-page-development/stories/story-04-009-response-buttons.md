# Story 04-009: Create Response Buttons Component

## Story

**As a** user
**I want** clear response buttons
**So that** I can indicate position and audio matches

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Build the response buttons component showing position match (A) and audio match (L) buttons with appropriate visibility based on training mode.

## Acceptance Criteria

- [ ] Position button shows for position-only and dual modes
- [ ] Audio button shows for audio-only and dual modes
- [ ] Keyboard shortcut hints displayed
- [ ] Touch targets are large enough (44x44 minimum)
- [ ] Press animation feedback
- [ ] Disabled state when not in active trial

## Technical Details

```typescript
// src/components/training/ResponseButtons.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TrainingMode } from '@neuralift/core';

interface ResponseButtonsProps {
  mode: TrainingMode;
  onPositionMatch: () => void;
  onAudioMatch: () => void;
  disabled?: boolean;
}

export function ResponseButtons({
  mode,
  onPositionMatch,
  onAudioMatch,
  disabled = false,
}: ResponseButtonsProps) {
  const showPosition = mode !== 'audio-only';
  const showAudio = mode !== 'position-only';

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
      {showPosition && (
        <ResponseButton
          data-tour="position-button"
          label="Position Match"
          shortcut="A"
          icon="📍"
          onClick={onPositionMatch}
          disabled={disabled}
          ariaLabel="Position match - press when current position matches position from N steps ago"
        />
      )}
      {showAudio && (
        <ResponseButton
          data-tour="audio-button"
          label="Audio Match"
          shortcut="L"
          icon="🔊"
          onClick={onAudioMatch}
          disabled={disabled}
          ariaLabel="Audio match - press when current letter matches letter from N steps ago"
        />
      )}
    </div>
  );
}

interface ResponseButtonProps {
  label: string;
  shortcut: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  'data-tour'?: string;
}

function ResponseButton({
  label,
  shortcut,
  icon,
  onClick,
  disabled,
  ariaLabel,
  ...props
}: ResponseButtonProps) {
  return (
    <motion.button
      {...props}
      className={cn(
        'flex flex-col items-center justify-center flex-1',
        'min-h-[88px] sm:min-h-[100px]',
        'rounded-2xl border-2 border-border-default',
        'bg-surface-subtle',
        'transition-colors duration-150',
        'hover:bg-surface-hover hover:border-border-hover',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface-subtle'
      )}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-xs text-text-muted mt-1">
        [ {shortcut} ]
      </span>
    </motion.button>
  );
}
```

## Tasks

- [ ] Create src/components/training/ResponseButtons.tsx
- [ ] Implement mode-based visibility
- [ ] Add press animations
- [ ] Add keyboard shortcut hints
- [ ] Ensure touch targets meet a11y requirements
- [ ] Add data-tour attributes for guided tour
- [ ] Test with different modes

## Dependencies

- Story 02-003 (Tailwind Config)
