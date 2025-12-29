'use client';

/**
 * AnthropicLLMService
 *
 * Implementation of ILLMService using Anthropic API via Netlify serverless function.
 * Provides personalized feedback and recommendations for training sessions.
 */

import type {
  ILLMService,
  LLMFeedbackResponse,
  FeedbackContext,
  TrainingRecommendation,
  UserProfile,
} from '@neuralift/core';

/**
 * Default feedback responses when LLM is unavailable
 */
const DEFAULT_FEEDBACK: LLMFeedbackResponse = {
  feedback: 'Great session! Keep practicing to strengthen your working memory.',
  recommendations: [
    'Focus on maintaining attention throughout the session',
    'Take short breaks between sessions to maintain focus',
    'Practice consistently for best results',
  ],
  encouragement: 'Every session counts toward building a stronger mind!',
  focusAreas: ['Consistency', 'Focus'],
};

/**
 * Anthropic-powered LLM service for personalized feedback
 */
export class AnthropicLLMService implements ILLMService {
  private apiEndpoint: string;

  constructor() {
    // Use Netlify function endpoint
    this.apiEndpoint = '/.netlify/functions/llm-feedback';
  }

  /**
   * Generate personalized feedback for a completed session
   */
  async generateSessionFeedback(context: FeedbackContext): Promise<LLMFeedbackResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'session-feedback',
          session: context.session,
          profile: context.profile,
        }),
      });

      if (!response.ok) {
        console.warn('[AnthropicLLMService] API request failed, using default feedback');
        return this.getDefaultFeedback(context);
      }

      const data = (await response.json()) as LLMFeedbackResponse;
      return data;
    } catch (error) {
      console.warn('[AnthropicLLMService] Error generating feedback:', error);
      return this.getDefaultFeedback(context);
    }
  }

  /**
   * Get training recommendations based on user profile
   */
  async getTrainingRecommendations(profile: UserProfile): Promise<TrainingRecommendation[]> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'recommendations',
          profile,
        }),
      });

      if (!response.ok) {
        console.warn('[AnthropicLLMService] API request failed, using default recommendations');
        return this.getDefaultRecommendations(profile);
      }

      const data = (await response.json()) as { recommendations: TrainingRecommendation[] };
      return data.recommendations;
    } catch (error) {
      console.warn('[AnthropicLLMService] Error getting recommendations:', error);
      return this.getDefaultRecommendations(profile);
    }
  }

  /**
   * Generate a motivational message for the user
   */
  async generateMotivation(profile: UserProfile): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'motivation',
          profile,
        }),
      });

      if (!response.ok) {
        return this.getDefaultMotivation(profile);
      }

      const data = (await response.json()) as { motivation: string };
      return data.motivation;
    } catch (error) {
      console.warn('[AnthropicLLMService] Error generating motivation:', error);
      return this.getDefaultMotivation(profile);
    }
  }

  /**
   * Check if the LLM service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'health-check',
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate context-aware default feedback when API is unavailable
   */
  private getDefaultFeedback(context: FeedbackContext): LLMFeedbackResponse {
    const { session } = context;
    const accuracy = session.combinedAccuracy;

    let feedback: string;
    let encouragement: string;

    if (accuracy >= 90) {
      feedback = 'Outstanding performance! Your working memory is showing excellent results.';
      encouragement = 'You\'re mastering this level - consider challenging yourself with the next difficulty!';
    } else if (accuracy >= 75) {
      feedback = 'Great job! You\'re making solid progress with your training.';
      encouragement = 'Keep up the consistent practice and you\'ll see even better results!';
    } else if (accuracy >= 60) {
      feedback = 'Good effort! Every session helps build your cognitive abilities.';
      encouragement = 'Focus on taking your time with responses - accuracy comes with practice.';
    } else {
      feedback = 'Thanks for completing this session! Working memory training takes time.';
      encouragement = 'Don\'t be discouraged - the challenge is what makes your brain stronger!';
    }

    return {
      feedback,
      recommendations: DEFAULT_FEEDBACK.recommendations,
      encouragement,
      focusAreas: DEFAULT_FEEDBACK.focusAreas,
    };
  }

  /**
   * Generate default recommendations based on profile
   */
  private getDefaultRecommendations(profile: UserProfile): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = [];

    // Recommend based on current level
    if (profile.currentLevel <= 2) {
      recommendations.push({
        recommendedLevel: 'dual-2',
        reason: 'Continue building your foundation with dual 2-back',
        priority: 1,
      });
    } else {
      recommendations.push({
        recommendedLevel: `dual-${profile.currentLevel}`,
        reason: 'Practice at your current level to maintain performance',
        priority: 1,
      });
    }

    // Recommend based on modality strength
    if (profile.strengthsWeaknesses.strongerModality === 'position') {
      recommendations.push({
        recommendedLevel: 'audio-2',
        reason: 'Practice audio-only to improve your weaker modality',
        priority: 2,
      });
    } else if (profile.strengthsWeaknesses.strongerModality === 'audio') {
      recommendations.push({
        recommendedLevel: 'position-2',
        reason: 'Practice position-only to improve your weaker modality',
        priority: 2,
      });
    }

    return recommendations;
  }

  /**
   * Generate default motivational message
   */
  private getDefaultMotivation(profile: UserProfile): string {
    if (profile.currentStreak > 7) {
      return `Amazing! You're on a ${profile.currentStreak}-day streak. Your dedication is truly impressive!`;
    } else if (profile.currentStreak > 0) {
      return `You're on a ${profile.currentStreak}-day streak! Keep the momentum going!`;
    } else if (profile.totalSessions > 10) {
      return `You've completed ${profile.totalSessions} sessions! Your commitment to brain training is paying off.`;
    } else {
      return 'Every session strengthens your working memory. Let\'s train!';
    }
  }
}
