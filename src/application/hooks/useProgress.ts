'use client';

/**
 * useProgress Hook
 *
 * Provides access to user progress data with loading and error states.
 */

import { useEffect, useState, useCallback } from 'react';
import { useCore } from '../providers/CoreProvider';
import type { UserProgress } from '@neuralift/core';

/**
 * Hook return type
 */
export interface UseProgressReturn {
  /** User's current progress */
  progress: UserProgress | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refresh progress data */
  refresh: () => Promise<void>;
  /** Unlock a specific level */
  unlockLevel: (levelId: string) => Promise<void>;
  /** Check if a level is unlocked */
  isLevelUnlocked: (levelId: string) => boolean;
  /** Update current level */
  setCurrentLevel: (levelId: string) => Promise<void>;
}

export function useProgress(): UseProgressReturn {
  const core = useCore();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load progress data
   */
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await core.repositories.progress.get();
      setProgress(data);
    } catch (err) {
      const loadError = err instanceof Error ? err : new Error('Failed to load progress');
      setError(loadError);
      console.error('[useProgress] Failed to load:', loadError);
    } finally {
      setLoading(false);
    }
  }, [core.repositories.progress]);

  /**
   * Refresh progress data
   */
  const refresh = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  /**
   * Unlock a specific level
   */
  const unlockLevel = useCallback(
    async (levelId: string) => {
      try {
        await core.repositories.progress.unlockLevel(levelId);
        // Refresh to get updated state
        await loadProgress();
      } catch (err) {
        const unlockError = err instanceof Error ? err : new Error('Failed to unlock level');
        setError(unlockError);
        throw unlockError;
      }
    },
    [core.repositories.progress, loadProgress]
  );

  /**
   * Check if a level is unlocked (synchronous, from cached state)
   */
  const isLevelUnlocked = useCallback(
    (levelId: string): boolean => {
      if (!progress) return false;
      return progress.unlockedLevels.includes(levelId);
    },
    [progress]
  );

  /**
   * Update current level
   */
  const setCurrentLevel = useCallback(
    async (levelId: string) => {
      try {
        await core.repositories.progress.updateField('currentLevel', levelId);
        // Refresh to get updated state
        await loadProgress();
      } catch (err) {
        const updateError = err instanceof Error ? err : new Error('Failed to update level');
        setError(updateError);
        throw updateError;
      }
    },
    [core.repositories.progress, loadProgress]
  );

  // Load progress on mount
  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    error,
    refresh,
    unlockLevel,
    isLevelUnlocked,
    setCurrentLevel,
  };
}
