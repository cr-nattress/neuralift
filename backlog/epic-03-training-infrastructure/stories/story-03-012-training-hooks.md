# Story 03-012: Create Training Hooks

## Story

**As a** developer
**I want** React hooks for training functionality
**So that** components can easily integrate with core use cases

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create React hooks that compose core use cases with UI state management, providing a clean API for training components.

## Acceptance Criteria

- [ ] useTrainingSession hook for managing sessions
- [ ] useProgress hook for user progress
- [ ] useLLMFeedback hook for AI feedback
- [ ] Hooks handle loading and error states
- [ ] Hooks integrate with Zustand store

## Technical Details

### useTrainingSession Hook

```typescript
// src/application/hooks/useTrainingSession.ts
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useCore } from '../providers/CoreProvider';
import { useSessionStore, selectCurrentTrial, selectProgress } from '../stores/sessionStore';
import { useAnalytics } from './useAnalytics';
import { nanoid } from 'nanoid';
import type { LevelConfig } from '@neuralift/core';

export function useTrainingSession(levelConfig: LevelConfig) {
  const core = useCore();
  const { track, trackImmediate } = useAnalytics();
  const trialTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    sessionId,
    status,
    trials,
    currentTrialIndex,
    mode,
    nBack,
    initializeSession,
    startCountdown,
    startSession,
    pauseSession,
    resumeSession,
    recordPositionResponse,
    recordAudioResponse,
    advanceToNextTrial,
    showTrialFeedback,
    hideFeedback,
    completeSession,
    resetSession,
  } = useSessionStore();

  const currentTrial = useSessionStore(selectCurrentTrial);
  const progress = useSessionStore(selectProgress);

  // Initialize session
  const initialize = useCallback(async () => {
    const newSessionId = nanoid();

    // Generate sequence using core service
    const generatedTrials = core.services.sequenceGenerator.generate({
      nBack: levelConfig.nBack,
      trialCount: levelConfig.defaultTrialCount,
      mode: levelConfig.mode,
    });

    // Convert to TrialData format
    const trialData = generatedTrials.map((trial, index) => ({
      id: index,
      position: trial.position,
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

    // Initialize audio
    await core.services.audioPlayer.initialize();
  }, [core, levelConfig, initializeSession]);

  // Start countdown then session
  const start = useCallback(async () => {
    startCountdown();

    // 3 second countdown
    await new Promise(resolve => setTimeout(resolve, 3000));

    startSession();

    await trackImmediate({
      type: 'SESSION_STARTED',
      category: 'session',
      sessionId,
      payload: {
        sessionId: sessionId!,
        levelId: levelConfig.id,
        nBack: levelConfig.nBack,
        mode: levelConfig.mode,
        trialCount: trials.length,
      },
    });

    // Start first trial
    playTrial();
  }, [startCountdown, startSession, sessionId, levelConfig, trials.length, trackImmediate]);

  // Play current trial
  const playTrial = useCallback(async () => {
    if (!currentTrial || status !== 'active') return;

    // Play audio letter
    await core.services.audioPlayer.playLetter(currentTrial.audioLetter);

    // Set timer for trial duration
    trialTimerRef.current = setTimeout(() => {
      onTrialEnd();
    }, levelConfig.trialDuration);
  }, [currentTrial, status, core, levelConfig.trialDuration]);

  // Handle trial end
  const onTrialEnd = useCallback(() => {
    if (trialTimerRef.current) {
      clearTimeout(trialTimerRef.current);
    }

    // Track trial completion
    if (currentTrial) {
      track({
        type: 'TRIAL_COMPLETED',
        category: 'trial',
        sessionId,
        payload: {
          sessionId: sessionId!,
          trialIndex: currentTrialIndex,
          positionCorrect: currentTrial.userPositionResponse === currentTrial.isPositionMatch,
          audioCorrect: currentTrial.userAudioResponse === currentTrial.isAudioMatch,
          positionResponseTime: currentTrial.positionResponseTime,
          audioResponseTime: currentTrial.audioResponseTime,
          wasPositionMatch: currentTrial.isPositionMatch,
          wasAudioMatch: currentTrial.isAudioMatch,
        },
      });
    }

    advanceToNextTrial();
  }, [currentTrial, sessionId, currentTrialIndex, track, advanceToNextTrial]);

  // Handle position response
  const respondPosition = useCallback(() => {
    if (status !== 'active' || !currentTrial) return;

    const isCorrect = currentTrial.isPositionMatch;
    recordPositionResponse(isCorrect);

    // Play feedback sound
    core.services.audioPlayer.playFeedback(isCorrect ? 'correct' : 'incorrect');
    showTrialFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(hideFeedback, 200);
  }, [status, currentTrial, recordPositionResponse, core, showTrialFeedback, hideFeedback]);

  // Handle audio response
  const respondAudio = useCallback(() => {
    if (status !== 'active' || !currentTrial) return;

    const isCorrect = currentTrial.isAudioMatch;
    recordAudioResponse(isCorrect);

    // Play feedback sound
    core.services.audioPlayer.playFeedback(isCorrect ? 'correct' : 'incorrect');
    showTrialFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(hideFeedback, 200);
  }, [status, currentTrial, recordAudioResponse, core, showTrialFeedback, hideFeedback]);

  // Handle session completion
  const finishSession = useCallback(async () => {
    if (!sessionId) return;

    const result = await core.completeSession.execute(sessionId, trials);
    completeSession();

    return result;
  }, [sessionId, trials, core, completeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trialTimerRef.current) {
        clearTimeout(trialTimerRef.current);
      }
    };
  }, []);

  // Auto-advance trials
  useEffect(() => {
    if (status === 'active' && currentTrialIndex > 0) {
      playTrial();
    }
  }, [currentTrialIndex, status, playTrial]);

  return {
    // State
    sessionId,
    status,
    currentTrial,
    progress,
    mode,
    nBack,

    // Actions
    initialize,
    start,
    pause: pauseSession,
    resume: resumeSession,
    respondPosition,
    respondAudio,
    finishSession,
    reset: resetSession,
  };
}
```

### useProgress Hook

```typescript
// src/application/hooks/useProgress.ts
'use client';

import { useEffect, useState } from 'react';
import { useCore } from '../providers/CoreProvider';
import type { UserProgress } from '@neuralift/core';

export function useProgress() {
  const core = useCore();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const data = await core.repositories.progress.get();
        setProgress(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load progress'));
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [core]);

  const refresh = async () => {
    setLoading(true);
    const data = await core.repositories.progress.get();
    setProgress(data);
    setLoading(false);
  };

  return { progress, loading, error, refresh };
}
```

### useLLMFeedback Hook

```typescript
// src/application/hooks/useLLMFeedback.ts
'use client';

import { useState, useCallback } from 'react';
import { useCore } from '../providers/CoreProvider';
import type { SessionResult, LLMFeedbackResponse } from '@neuralift/core';

export function useLLMFeedback() {
  const core = useCore();
  const [feedback, setFeedback] = useState<LLMFeedbackResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getSessionFeedback = useCallback(
    async (session: SessionResult) => {
      try {
        setLoading(true);
        setError(null);

        // Build user profile first
        const profile = await core.buildUserProfile.execute();

        // Get LLM feedback
        const result = await core.services.llmService.getSessionFeedback(session, profile);
        setFeedback(result);

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get feedback');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [core]
  );

  const getRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await core.buildUserProfile.execute();
      const result = await core.getRecommendations.execute(profile);
      setFeedback(result);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get recommendations');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [core]);

  return {
    feedback,
    loading,
    error,
    getSessionFeedback,
    getRecommendations,
  };
}
```

## Tasks

- [ ] Create src/application/hooks/useTrainingSession.ts
- [ ] Create src/application/hooks/useProgress.ts
- [ ] Create src/application/hooks/useLLMFeedback.ts
- [ ] Integrate with Zustand session store
- [ ] Handle keyboard shortcuts (A, L keys)
- [ ] Test session flow end-to-end
- [ ] Export all hooks from application index

## Dependencies

- Story 01-008 (Core Provider)
- Story 03-007 (Session Store)
- Story 03-011 (LLM Service)

## Notes

- Hooks compose core use cases with UI state
- Keyboard handling should be added at component level
- Loading states are important for UX
