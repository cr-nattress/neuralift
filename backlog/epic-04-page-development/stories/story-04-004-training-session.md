# Story 04-004: Create Training Session Page

## Story

**As a** user
**I want** an active training interface
**So that** I can practice n-back exercises

## Points: 8

## Priority: Critical

## Status: TODO

## Description

Build the main training session page with the 3x3 grid, response buttons, progress indicator, and session controls. This is the core gameplay experience.

## Acceptance Criteria

- [ ] 3x3 grid displays with cell activation
- [ ] Audio letters play synchronously
- [ ] Response buttons work (position/audio)
- [ ] Keyboard shortcuts (A, L) work
- [ ] Progress bar shows trial count
- [ ] Pause/resume functionality
- [ ] Quick help available
- [ ] Session completes and navigates to results
- [ ] Countdown before session starts

## Technical Details

```typescript
// src/app/train/[levelId]/session/page.tsx
'use client';

import { useEffect } from 'react';
import { useTrainingSession } from '@/application/hooks/useTrainingSession';

export default function TrainingSessionPage({ params }: { params: { levelId: string } }) {
  const level = LEVELS[params.levelId];
  const {
    sessionId,
    status,
    currentTrial,
    progress,
    initialize,
    start,
    pause,
    resume,
    respondPosition,
    respondAudio,
    finishSession,
  } = useTrainingSession(level);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'active') return;

      if (e.key === 'a' || e.key === 'A') {
        respondPosition();
      } else if (e.key === 'l' || e.key === 'L') {
        respondAudio();
      } else if (e.key === 'Escape') {
        pause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, respondPosition, respondAudio, pause]);

  // Handle session completion
  useEffect(() => {
    if (status === 'completed') {
      finishSession().then((result) => {
        router.push(`/results/${result.sessionId}`);
      });
    }
  }, [status, finishSession]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Countdown Overlay */}
      {status === 'countdown' && <CountdownOverlay />}

      {/* Pause Overlay */}
      {status === 'paused' && <PauseOverlay onResume={resume} />}

      {/* Session Header */}
      <SessionHeader
        levelName={level.name}
        current={progress.current}
        total={progress.total}
        onPause={pause}
      />

      {/* Quick Help */}
      <QuickHelp nBack={level.nBack} />

      {/* Training Grid */}
      <Grid activePosition={currentTrial?.position ?? null} />

      {/* Current Letter Display */}
      {currentTrial && (
        <div className="text-2xl text-text-secondary my-4">
          🔊 "{currentTrial.audioLetter}"
        </div>
      )}

      {/* Response Buttons */}
      <ResponseButtons
        mode={level.mode}
        onPositionMatch={respondPosition}
        onAudioMatch={respondAudio}
        disabled={status !== 'active'}
      />

      {/* Progress Bar */}
      <ProgressBar
        value={progress.current}
        max={progress.total}
        className="w-full max-w-md mt-8"
      />
    </main>
  );
}
```

## Components

- Grid (Story 04-008)
- ResponseButtons (Story 04-009)
- SessionHeader
- CountdownOverlay
- PauseOverlay
- QuickHelp

## Tasks

- [ ] Create src/app/train/[levelId]/session/page.tsx
- [ ] Create SessionHeader component
- [ ] Create CountdownOverlay component
- [ ] Create PauseOverlay component
- [ ] Integrate useTrainingSession hook
- [ ] Add keyboard event handlers
- [ ] Handle session completion redirect
- [ ] Test full session flow

## Dependencies

- Story 02-006 (ProgressBar)
- Story 03-007 (Session Store)
- Story 03-012 (Training Hooks)
- Story 04-008 (Grid)
- Story 04-009 (ResponseButtons)
