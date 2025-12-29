'use client';

/**
 * useLLMFeedback Hook
 *
 * Provides access to LLM-powered personalized feedback and recommendations.
 * Handles loading states, errors, and caching.
 */

import { useState, useCallback } from 'react';
import { useCore } from '../providers/CoreProvider';
import type {
  LLMFeedbackResponse,
  TrainingRecommendation,
  SessionResult,
  UserProfile,
} from '@neuralift/core';

/**
 * Hook return type
 */
export interface UseLLMFeedbackReturn {
  /** Current feedback response */
  feedback: LLMFeedbackResponse | null;
  /** Training recommendations */
  recommendations: TrainingRecommendation[];
  /** Current motivation message */
  motivation: string | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Whether the LLM service is available */
  isAvailable: boolean | null;
  /** Get feedback for a completed session */
  getSessionFeedback: (session: SessionResult, profile: UserProfile) => Promise<LLMFeedbackResponse>;
  /** Get training recommendations */
  getRecommendations: (profile: UserProfile) => Promise<TrainingRecommendation[]>;
  /** Get motivational message */
  getMotivation: (profile: UserProfile) => Promise<string>;
  /** Check if LLM service is available */
  checkAvailability: () => Promise<boolean>;
  /** Clear current feedback state */
  clearFeedback: () => void;
}

export function useLLMFeedback(): UseLLMFeedbackReturn {
  const core = useCore();
  const [feedback, setFeedback] = useState<LLMFeedbackResponse | null>(null);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  /**
   * Get feedback for a completed session
   */
  const getSessionFeedback = useCallback(
    async (session: SessionResult, profile: UserProfile): Promise<LLMFeedbackResponse> => {
      try {
        setLoading(true);
        setError(null);

        const result = await core.llmService.generateSessionFeedback({
          session,
          profile,
        });

        setFeedback(result);
        return result;
      } catch (err) {
        const feedbackError = err instanceof Error ? err : new Error('Failed to get feedback');
        setError(feedbackError);
        throw feedbackError;
      } finally {
        setLoading(false);
      }
    },
    [core.llmService]
  );

  /**
   * Get training recommendations
   */
  const getRecommendations = useCallback(
    async (profile: UserProfile): Promise<TrainingRecommendation[]> => {
      try {
        setLoading(true);
        setError(null);

        const result = await core.llmService.getTrainingRecommendations(profile);
        setRecommendations(result);
        return result;
      } catch (err) {
        const recError = err instanceof Error ? err : new Error('Failed to get recommendations');
        setError(recError);
        throw recError;
      } finally {
        setLoading(false);
      }
    },
    [core.llmService]
  );

  /**
   * Get motivational message
   */
  const getMotivation = useCallback(
    async (profile: UserProfile): Promise<string> => {
      try {
        setLoading(true);
        setError(null);

        const result = await core.llmService.generateMotivation(profile);
        setMotivation(result);
        return result;
      } catch (err) {
        const motError = err instanceof Error ? err : new Error('Failed to get motivation');
        setError(motError);
        throw motError;
      } finally {
        setLoading(false);
      }
    },
    [core.llmService]
  );

  /**
   * Check if LLM service is available
   */
  const checkAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const available = await core.llmService.isAvailable();
      setIsAvailable(available);
      return available;
    } catch {
      setIsAvailable(false);
      return false;
    }
  }, [core.llmService]);

  /**
   * Clear feedback state
   */
  const clearFeedback = useCallback(() => {
    setFeedback(null);
    setRecommendations([]);
    setMotivation(null);
    setError(null);
  }, []);

  return {
    feedback,
    recommendations,
    motivation,
    loading,
    error,
    isAvailable,
    getSessionFeedback,
    getRecommendations,
    getMotivation,
    checkAvailability,
    clearFeedback,
  };
}
