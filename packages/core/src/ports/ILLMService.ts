/**
 * ILLMService Port
 *
 * Interface for LLM-powered personalized feedback generation.
 */

import type { UserProfile } from '../domain/entities/UserProfile';
import type { SessionResult } from '../domain/entities/Session';

/**
 * Response from the LLM feedback generation
 */
export interface LLMFeedbackResponse {
  /** Personalized feedback message */
  feedback: string;
  /** Specific recommendations for improvement */
  recommendations: string[];
  /** Encouragement or motivational message */
  encouragement: string;
  /** Suggested focus areas for next session */
  focusAreas: string[];
}

/**
 * Context for generating feedback
 */
export interface FeedbackContext {
  /** The completed session result */
  session: SessionResult;
  /** The user's profile */
  profile: UserProfile;
  /** Number of recent sessions to consider */
  recentSessionCount?: number;
}

/**
 * Training recommendation from LLM
 */
export interface TrainingRecommendation {
  /** Recommended level to practice */
  recommendedLevel: string;
  /** Reason for the recommendation */
  reason: string;
  /** Priority (1 = highest) */
  priority: number;
}

export interface ILLMService {
  /**
   * Generate personalized feedback for a completed session
   */
  generateSessionFeedback(context: FeedbackContext): Promise<LLMFeedbackResponse>;

  /**
   * Get training recommendations based on user profile
   */
  getTrainingRecommendations(profile: UserProfile): Promise<TrainingRecommendation[]>;

  /**
   * Generate a motivational message for the user
   */
  generateMotivation(profile: UserProfile): Promise<string>;

  /**
   * Check if the LLM service is available
   */
  isAvailable(): Promise<boolean>;
}
