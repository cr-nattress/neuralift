'use client';

/**
 * useTrainingSession Hook
 *
 * Manages the complete lifecycle of a training session including:
 * - Session initialization and countdown
 * - Trial progression and timing
 * - Response handling with immediate feedback
 * - Session completion and scoring
 */

import { useCallback, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useCore } from '../providers/CoreProvider';
import {
  useSessionStore,
  selectCurrentTrial,
  selectProgress,
  selectIsActive,
  selectIsComplete,
} from '../stores/sessionStore';
import { useAnalytics, type TrackEventInput } from './useAnalytics';
import {
  DEFAULT_TRIAL_DURATION_MS,
  DEFAULT_TRIALS_PER_SESSION,
  type LevelConfig,
  type TrialData,
  type SessionResult,
} from '@neuralift/core';

/**
 * Extended level config with session-specific settings
 */
export interface SessionLevelConfig extends LevelConfig {
  /** Number of trials (defaults to DEFAULT_TRIALS_PER_SESSION) */
  trialCount?: number;
  /** Trial duration in ms (defaults to DEFAULT_TRIAL_DURATION_MS) */
  trialDuration?: number;
}

/**
 * Hook return type
 */
export interface UseTrainingSessionReturn {
  // State
  sessionId: string | null;
  status: 'idle' | 'countdown' | 'active' | 'paused' | 'completed';
  currentTrial: TrialData | undefined;
  progress: { current: number; total: number; percentage: number };
  isActive: boolean;
  isComplete: boolean;
  countdownValue: number;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;

  // Actions
  initialize: () => Promise<void>;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  respondPosition: () => void;
  respondAudio: () => void;
  finishSession: () => Promise<SessionResult | null>;
  reset: () => void;
}

export function useTrainingSession(levelConfig: SessionLevelConfig): UseTrainingSessionReturn {
  const core = useCore();
  const { track, trackImmediate } = useAnalytics();
  const trialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get effective config values
  const trialCount = levelConfig.trialCount ?? DEFAULT_TRIALS_PER_SESSION;
  const trialDuration = levelConfig.trialDuration ?? DEFAULT_TRIAL_DURATION_MS;

  // Store state and actions
  const {
    sessionId,
    status,
    trials,
    currentTrialIndex,
    mode,
    nBack,
    countdownValue,
    showFeedback,
    feedbackType,
    initializeSession,
    startCountdown,
    setCountdownValue,
    startSession,
    pauseSession,
    resumeSession,
    recordPositionResponse,
    recordAudioResponse,
    advanceToNextTrial,
    startTrial,
    showTrialFeedback,
    hideFeedback,
    completeSession,
    resetSession,
  } = useSessionStore();

  // Selectors
  const currentTrial = useSessionStore(selectCurrentTrial);
  const progress = useSessionStore(selectProgress);
  const isActive = useSessionStore(selectIsActive);
  const isComplete = useSessionStore(selectIsComplete);

  /**
   * Clear all timers
   */
  const clearTimers = useCallback(() => {
    if (trialTimerRef.current) {
      clearTimeout(trialTimerRef.current);
      trialTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  /**
   * Initialize a new session
   */
  const initialize = useCallback(async () => {
    clearTimers();

    const newSessionId = nanoid();

    // Generate sequence using core service
    const generatedTrials = core.services.sequenceGenerator.generate({
      nBack: levelConfig.nBack,
      trialCount,
      mode: levelConfig.mode,
    });

    // Convert to TrialData format
    const trialData: TrialData[] = generatedTrials.map((trial, index) => ({
      id: index,
      position: trial.position as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      audioLetter: trial.audioLetter,
      isPositionMatch: trial.isPositionMatch,
      isAudioMatch: trial.isAudioMatch,
      userPositionResponse: null,
      userAudioResponse: null,
      positionResponseTime: null,
      audioResponseTime: null,
      stimulusTimestamp: 0,
    }));

    initializeSession({
      sessionId: newSessionId,
      levelId: levelConfig.id,
      nBack: levelConfig.nBack,
      mode: levelConfig.mode,
      trials: trialData,
    });

    // Initialize audio player
    await core.audioPlayer.initialize();
  }, [
    core.services.sequenceGenerator,
    core.audioPlayer,
    levelConfig,
    trialCount,
    initializeSession,
    clearTimers,
  ]);

  /**
   * Play the current trial
   */
  const playTrial = useCallback(async () => {
    if (!currentTrial || status !== 'active') return;

    // Mark trial start time
    startTrial();

    // Play audio letter
    await core.audioPlayer.playLetter(currentTrial.audioLetter);

    // Set timer for trial duration
    trialTimerRef.current = setTimeout(() => {
      onTrialEnd();
    }, trialDuration);
  }, [currentTrial, status, core.audioPlayer, trialDuration, startTrial]);

  /**
   * Handle trial end
   */
  const onTrialEnd = useCallback(() => {
    if (trialTimerRef.current) {
      clearTimeout(trialTimerRef.current);
      trialTimerRef.current = null;
    }

    const state = useSessionStore.getState();
    const trial = state.trials[state.currentTrialIndex];

    // Track trial completion
    if (trial && sessionId) {
      const positionCorrect = trial.userPositionResponse === trial.isPositionMatch ||
        (trial.userPositionResponse === null && !trial.isPositionMatch);
      const audioCorrect = trial.userAudioResponse === trial.isAudioMatch ||
        (trial.userAudioResponse === null && !trial.isAudioMatch);

      track({
        type: 'TRIAL_COMPLETED',
        category: 'trial',
        sessionId,
        payload: {
          trialIndex: state.currentTrialIndex,
          positionCorrect,
          audioCorrect,
          positionResponseTime: trial.positionResponseTime,
          audioResponseTime: trial.audioResponseTime,
          wasPositionMatch: trial.isPositionMatch,
          wasAudioMatch: trial.isAudioMatch,
        },
      });
    }

    // Check if this was the last trial
    if (state.currentTrialIndex >= state.trials.length - 1) {
      completeSession();
    } else {
      advanceToNextTrial();
    }
  }, [sessionId, track, advanceToNextTrial, completeSession]);

  /**
   * Start the session with countdown
   */
  const start = useCallback(async () => {
    if (!sessionId) {
      await initialize();
    }

    startCountdown();

    // 3 second countdown
    let count = 3;
    setCountdownValue(count);

    countdownTimerRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        startSession();

        // Track session start
        const state = useSessionStore.getState();
        const sessionStartEvent: TrackEventInput = {
          type: 'SESSION_STARTED',
          category: 'session',
          payload: {
            levelId: levelConfig.id,
            nBack: levelConfig.nBack,
            mode: levelConfig.mode,
            trialCount: state.trials.length,
          },
        };
        if (state.sessionId) {
          sessionStartEvent.sessionId = state.sessionId;
        }
        void trackImmediate(sessionStartEvent);

        // Start first trial
        void playTrial();
      } else {
        setCountdownValue(count);
      }
    }, 1000);
  }, [
    sessionId,
    initialize,
    startCountdown,
    setCountdownValue,
    startSession,
    trackImmediate,
    levelConfig,
    playTrial,
  ]);

  /**
   * Handle position response
   */
  const respondPosition = useCallback(() => {
    if (status !== 'active' || !currentTrial) return;

    const state = useSessionStore.getState();
    if (state.hasRespondedPosition) return;

    const isCorrect = currentTrial.isPositionMatch;
    recordPositionResponse();

    // Play feedback sound
    void core.audioPlayer.playFeedback(isCorrect ? 'correct' : 'incorrect');
    showTrialFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(hideFeedback, 200);
  }, [status, currentTrial, recordPositionResponse, core.audioPlayer, showTrialFeedback, hideFeedback]);

  /**
   * Handle audio response
   */
  const respondAudio = useCallback(() => {
    if (status !== 'active' || !currentTrial) return;

    const state = useSessionStore.getState();
    if (state.hasRespondedAudio) return;

    const isCorrect = currentTrial.isAudioMatch;
    recordAudioResponse();

    // Play feedback sound
    void core.audioPlayer.playFeedback(isCorrect ? 'correct' : 'incorrect');
    showTrialFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(hideFeedback, 200);
  }, [status, currentTrial, recordAudioResponse, core.audioPlayer, showTrialFeedback, hideFeedback]);

  /**
   * Pause the session
   */
  const pause = useCallback(() => {
    clearTimers();
    pauseSession();
  }, [clearTimers, pauseSession]);

  /**
   * Resume the session
   */
  const resume = useCallback(() => {
    resumeSession();
    void playTrial();
  }, [resumeSession, playTrial]);

  /**
   * Finish and save the session
   */
  const finishSession = useCallback(async (): Promise<SessionResult | null> => {
    if (!sessionId) return null;

    clearTimers();

    const state = useSessionStore.getState();
    const endTime = Date.now();

    // Calculate scores using scoring service
    const positionTrials = state.trials.map((t) => ({
      isMatch: t.isPositionMatch,
      userResponse: t.userPositionResponse,
      responseTime: t.positionResponseTime,
    }));

    const audioTrials = state.trials.map((t) => ({
      isMatch: t.isAudioMatch,
      userResponse: t.userAudioResponse,
      responseTime: t.audioResponseTime,
    }));

    const scoringResult = core.services.scoringService.calculateSessionResult(
      positionTrials,
      audioTrials,
      state.mode!
    );

    const duration = state.startTime ? endTime - state.startTime : 0;

    // Create session result matching SessionResult interface
    const sessionResult: SessionResult = {
      sessionId,
      levelId: state.levelId!,
      nBack: state.nBack!,
      mode: state.mode!,
      timestamp: new Date(state.startTime ?? endTime),
      duration,
      trials: state.trials,
      positionStats: scoringResult.positionStats,
      audioStats: scoringResult.audioStats,
      combinedAccuracy: scoringResult.combinedAccuracy,
      completed: true,
    };

    // Save to repository
    await core.repositories.session.save(sessionResult);

    // Update progress
    const progressData = await core.repositories.progress.get();
    await core.repositories.progress.save({
      ...progressData,
      totalSessions: progressData.totalSessions + 1,
      totalTime: progressData.totalTime + duration,
      lastSessionDate: new Date(),
    });

    // Update streak
    await core.repositories.progress.updateStreak();

    // Track completion
    void trackImmediate({
      type: 'SESSION_COMPLETED',
      category: 'session',
      sessionId,
      payload: {
        levelId: state.levelId,
        nBack: state.nBack,
        mode: state.mode,
        accuracy: scoringResult.combinedAccuracy,
        dPrime: scoringResult.combinedDPrime,
        duration,
      },
    });

    // Play completion sound
    void core.audioPlayer.playFeedback('complete');

    return sessionResult;
  }, [
    sessionId,
    clearTimers,
    core.services.scoringService,
    core.repositories.session,
    core.repositories.progress,
    core.audioPlayer,
    trackImmediate,
  ]);

  /**
   * Reset session state
   */
  const reset = useCallback(() => {
    clearTimers();
    resetSession();
  }, [clearTimers, resetSession]);

  // Auto-advance trials when index changes
  useEffect(() => {
    if (status === 'active' && currentTrialIndex > 0) {
      void playTrial();
    }
  }, [currentTrialIndex, status, playTrial]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    // State
    sessionId,
    status,
    currentTrial,
    progress,
    isActive,
    isComplete,
    countdownValue,
    showFeedback,
    feedbackType,

    // Actions
    initialize,
    start,
    pause,
    resume,
    respondPosition,
    respondAudio,
    finishSession,
    reset,
  };
}
