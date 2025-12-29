# Story 03-007: Create Session Store

## Story

**As a** developer
**I want** a Zustand store for session state
**So that** training UI has reactive real-time state

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create a Zustand store for managing active training session state in the UI layer. This handles real-time trial progression, responses, and session flow.

## Acceptance Criteria

- [ ] Zustand store with session state
- [ ] Actions for starting, responding, advancing trials
- [ ] Computed values for progress
- [ ] Integration with core use cases
- [ ] State reset on session end

## Technical Details

### Session Store

```typescript
// src/application/stores/sessionStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SessionConfig, TrialData, TrainingMode, NBackLevel } from '@neuralift/core';

interface SessionState {
  // Session metadata
  sessionId: string | null;
  levelId: string | null;
  nBack: NBackLevel | null;
  mode: TrainingMode | null;

  // Session status
  status: 'idle' | 'countdown' | 'active' | 'paused' | 'completed';
  startTime: number | null;

  // Trials
  trials: TrialData[];
  currentTrialIndex: number;
  trialStartTime: number | null;

  // Responses for current trial
  positionResponseTime: number | null;
  audioResponseTime: number | null;
  hasRespondedPosition: boolean;
  hasRespondedAudio: boolean;

  // UI state
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;

  // Actions
  initializeSession: (config: {
    sessionId: string;
    levelId: string;
    nBack: NBackLevel;
    mode: TrainingMode;
    trials: TrialData[];
  }) => void;
  startCountdown: () => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  recordPositionResponse: (isCorrect: boolean) => void;
  recordAudioResponse: (isCorrect: boolean) => void;
  advanceToNextTrial: () => void;
  showTrialFeedback: (type: 'correct' | 'incorrect') => void;
  hideFeedback: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sessionId: null,
      levelId: null,
      nBack: null,
      mode: null,
      status: 'idle',
      startTime: null,
      trials: [],
      currentTrialIndex: 0,
      trialStartTime: null,
      positionResponseTime: null,
      audioResponseTime: null,
      hasRespondedPosition: false,
      hasRespondedAudio: false,
      showFeedback: false,
      feedbackType: null,

      // Actions
      initializeSession: (config) =>
        set({
          sessionId: config.sessionId,
          levelId: config.levelId,
          nBack: config.nBack,
          mode: config.mode,
          trials: config.trials,
          currentTrialIndex: 0,
          status: 'idle',
        }),

      startCountdown: () => set({ status: 'countdown' }),

      startSession: () =>
        set({
          status: 'active',
          startTime: Date.now(),
          trialStartTime: Date.now(),
        }),

      pauseSession: () => set({ status: 'paused' }),

      resumeSession: () => set({ status: 'active' }),

      recordPositionResponse: (isCorrect) => {
        const state = get();
        if (state.hasRespondedPosition || state.status !== 'active') return;

        const responseTime = state.trialStartTime
          ? Date.now() - state.trialStartTime
          : 0;

        set({
          hasRespondedPosition: true,
          positionResponseTime: responseTime,
          trials: state.trials.map((trial, i) =>
            i === state.currentTrialIndex
              ? { ...trial, userPositionResponse: true, positionResponseTime: responseTime }
              : trial
          ),
        });
      },

      recordAudioResponse: (isCorrect) => {
        const state = get();
        if (state.hasRespondedAudio || state.status !== 'active') return;

        const responseTime = state.trialStartTime
          ? Date.now() - state.trialStartTime
          : 0;

        set({
          hasRespondedAudio: true,
          audioResponseTime: responseTime,
          trials: state.trials.map((trial, i) =>
            i === state.currentTrialIndex
              ? { ...trial, userAudioResponse: true, audioResponseTime: responseTime }
              : trial
          ),
        });
      },

      advanceToNextTrial: () => {
        const state = get();
        const nextIndex = state.currentTrialIndex + 1;

        if (nextIndex >= state.trials.length) {
          set({ status: 'completed' });
        } else {
          set({
            currentTrialIndex: nextIndex,
            trialStartTime: Date.now(),
            hasRespondedPosition: false,
            hasRespondedAudio: false,
            positionResponseTime: null,
            audioResponseTime: null,
            showFeedback: false,
            feedbackType: null,
          });
        }
      },

      showTrialFeedback: (type) => set({ showFeedback: true, feedbackType: type }),
      hideFeedback: () => set({ showFeedback: false, feedbackType: null }),

      completeSession: () => set({ status: 'completed' }),

      resetSession: () =>
        set({
          sessionId: null,
          levelId: null,
          nBack: null,
          mode: null,
          status: 'idle',
          startTime: null,
          trials: [],
          currentTrialIndex: 0,
          trialStartTime: null,
          positionResponseTime: null,
          audioResponseTime: null,
          hasRespondedPosition: false,
          hasRespondedAudio: false,
          showFeedback: false,
          feedbackType: null,
        }),
    }),
    { name: 'session-store' }
  )
);

// Selectors
export const selectCurrentTrial = (state: SessionState) =>
  state.trials[state.currentTrialIndex];

export const selectProgress = (state: SessionState) => ({
  current: state.currentTrialIndex + 1,
  total: state.trials.length,
  percentage: state.trials.length > 0
    ? ((state.currentTrialIndex + 1) / state.trials.length) * 100
    : 0,
});

export const selectIsActive = (state: SessionState) =>
  state.status === 'active';
```

## Tasks

- [ ] Create src/application/stores/sessionStore.ts
- [ ] Implement all state and actions
- [ ] Add selectors for common queries
- [ ] Enable devtools for debugging
- [ ] Test state transitions
- [ ] Test response recording
- [ ] Export from application index

## Dependencies

- Story 01-001 (Zustand installed)
- Story 01-006 (Domain Entities - types)

## Notes

- Zustand chosen for simplicity and performance
- devtools middleware enables Redux DevTools debugging
- UI state only - business logic remains in core
