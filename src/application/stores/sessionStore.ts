'use client';

/**
 * Session Store
 *
 * Zustand store for managing active training session state.
 * Handles real-time trial progression, responses, and session flow.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TrainingMode, NBackLevel, TrialData } from '@neuralift/core';

/**
 * Session status states
 */
export type SessionStatus = 'idle' | 'countdown' | 'active' | 'paused' | 'completed';

/**
 * Configuration for initializing a session
 */
export interface SessionInitConfig {
  sessionId: string;
  levelId: string;
  nBack: NBackLevel;
  mode: TrainingMode;
  trials: TrialData[];
}

/**
 * Session store state
 */
interface SessionState {
  // Session metadata
  sessionId: string | null;
  levelId: string | null;
  nBack: NBackLevel | null;
  mode: TrainingMode | null;

  // Session status
  status: SessionStatus;
  startTime: number | null;
  endTime: number | null;

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
  countdownValue: number;

  // Actions
  initializeSession: (config: SessionInitConfig) => void;
  startCountdown: () => void;
  setCountdownValue: (value: number) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  recordPositionResponse: () => void;
  recordAudioResponse: () => void;
  advanceToNextTrial: () => void;
  startTrial: () => void;
  showTrialFeedback: (type: 'correct' | 'incorrect') => void;
  hideFeedback: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

/**
 * Initial state values
 */
const initialState = {
  sessionId: null,
  levelId: null,
  nBack: null,
  mode: null,
  status: 'idle' as SessionStatus,
  startTime: null,
  endTime: null,
  trials: [],
  currentTrialIndex: 0,
  trialStartTime: null,
  positionResponseTime: null,
  audioResponseTime: null,
  hasRespondedPosition: false,
  hasRespondedAudio: false,
  showFeedback: false,
  feedbackType: null,
  countdownValue: 3,
};

/**
 * Session store
 */
export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /**
       * Initialize a new session with configuration
       */
      initializeSession: (config: SessionInitConfig) => {
        set({
          sessionId: config.sessionId,
          levelId: config.levelId,
          nBack: config.nBack,
          mode: config.mode,
          trials: config.trials,
          currentTrialIndex: 0,
          status: 'idle',
          startTime: null,
          endTime: null,
          trialStartTime: null,
          hasRespondedPosition: false,
          hasRespondedAudio: false,
          positionResponseTime: null,
          audioResponseTime: null,
          showFeedback: false,
          feedbackType: null,
          countdownValue: 3,
        });
      },

      /**
       * Start countdown before session begins
       */
      startCountdown: () => {
        set({ status: 'countdown', countdownValue: 3 });
      },

      /**
       * Update countdown value
       */
      setCountdownValue: (value: number) => {
        set({ countdownValue: value });
      },

      /**
       * Start the actual session after countdown
       */
      startSession: () => {
        const now = Date.now();
        set({
          status: 'active',
          startTime: now,
          trialStartTime: now,
        });
      },

      /**
       * Pause the session
       */
      pauseSession: () => {
        set({ status: 'paused' });
      },

      /**
       * Resume the session
       */
      resumeSession: () => {
        set({
          status: 'active',
          trialStartTime: Date.now(), // Reset trial timer
        });
      },

      /**
       * Record a position response for the current trial
       */
      recordPositionResponse: () => {
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
              ? {
                  ...trial,
                  userPositionResponse: true,
                  positionResponseTime: responseTime,
                }
              : trial
          ),
        });
      },

      /**
       * Record an audio response for the current trial
       */
      recordAudioResponse: () => {
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
              ? {
                  ...trial,
                  userAudioResponse: true,
                  audioResponseTime: responseTime,
                }
              : trial
          ),
        });
      },

      /**
       * Advance to the next trial
       */
      advanceToNextTrial: () => {
        const state = get();
        const nextIndex = state.currentTrialIndex + 1;

        if (nextIndex >= state.trials.length) {
          set({
            status: 'completed',
            endTime: Date.now(),
          });
        } else {
          set({
            currentTrialIndex: nextIndex,
            hasRespondedPosition: false,
            hasRespondedAudio: false,
            positionResponseTime: null,
            audioResponseTime: null,
            showFeedback: false,
            feedbackType: null,
          });
        }
      },

      /**
       * Start the current trial timer
       */
      startTrial: () => {
        set({ trialStartTime: Date.now() });
      },

      /**
       * Show feedback for the trial
       */
      showTrialFeedback: (type: 'correct' | 'incorrect') => {
        set({ showFeedback: true, feedbackType: type });
      },

      /**
       * Hide feedback
       */
      hideFeedback: () => {
        set({ showFeedback: false, feedbackType: null });
      },

      /**
       * Complete the session
       */
      completeSession: () => {
        set({
          status: 'completed',
          endTime: Date.now(),
        });
      },

      /**
       * Reset the session to initial state
       */
      resetSession: () => {
        set(initialState);
      },
    }),
    { name: 'session-store' }
  )
);

// ============================================================================
// Selectors
// ============================================================================

/**
 * Get the current trial
 */
export const selectCurrentTrial = (state: SessionState): TrialData | undefined =>
  state.trials[state.currentTrialIndex];

/**
 * Get session progress
 */
export const selectProgress = (state: SessionState) => ({
  current: state.currentTrialIndex + 1,
  total: state.trials.length,
  percentage:
    state.trials.length > 0
      ? ((state.currentTrialIndex + 1) / state.trials.length) * 100
      : 0,
});

/**
 * Check if session is active
 */
export const selectIsActive = (state: SessionState): boolean =>
  state.status === 'active';

/**
 * Check if session is complete
 */
export const selectIsComplete = (state: SessionState): boolean =>
  state.status === 'completed';

/**
 * Get session duration in milliseconds
 */
export const selectDuration = (state: SessionState): number => {
  if (!state.startTime) return 0;
  const endTime = state.endTime ?? Date.now();
  return endTime - state.startTime;
};

/**
 * Check if user can respond to position
 */
export const selectCanRespondPosition = (state: SessionState): boolean =>
  state.status === 'active' &&
  !state.hasRespondedPosition &&
  (state.mode === 'single-position' || state.mode === 'dual');

/**
 * Check if user can respond to audio
 */
export const selectCanRespondAudio = (state: SessionState): boolean =>
  state.status === 'active' &&
  !state.hasRespondedAudio &&
  (state.mode === 'single-audio' || state.mode === 'dual');
