/**
 * UserProfile Entity
 *
 * Represents aggregated user behavior and preferences.
 * Used for LLM-powered personalized feedback generation.
 */

import type { NBackLevel } from '../value-objects/NBackLevel';
import type { TrainingMode } from '../value-objects/TrainingMode';

/**
 * Training preferences derived from user behavior
 */
export interface TrainingPreferences {
  readonly preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | null;
  readonly averageSessionDuration: number;
  readonly preferredMode: TrainingMode | null;
  readonly sessionsPerWeek: number;
}

/**
 * Performance trends over time
 */
export interface PerformanceTrends {
  readonly overallTrend: 'improving' | 'stable' | 'declining';
  readonly positionTrend: 'improving' | 'stable' | 'declining';
  readonly audioTrend: 'improving' | 'stable' | 'declining';
  readonly recentAccuracies: number[];
}

/**
 * Identified strengths and weaknesses
 */
export interface StrengthsWeaknesses {
  readonly strongerModality: 'position' | 'audio' | 'balanced';
  readonly consistentlyStrugglesAt: NBackLevel | null;
  readonly consistentlyExcelsAt: NBackLevel | null;
}

/**
 * Behavioral patterns observed
 */
export interface BehavioralPatterns {
  readonly respondsQuicklyToPosition: boolean;
  readonly respondsQuicklyToAudio: boolean;
  readonly tendsToPressMatchTooOften: boolean;
  readonly tendsToPressMatchTooRarely: boolean;
  readonly performsBetterEarlyInSession: boolean;
  readonly performsBetterLateInSession: boolean;
}

/**
 * User profile for personalization
 */
export interface UserProfile {
  readonly id: string;
  readonly currentLevel: NBackLevel;
  readonly totalSessions: number;
  readonly totalTrainingTime: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly preferences: TrainingPreferences;
  readonly trends: PerformanceTrends;
  readonly strengthsWeaknesses: StrengthsWeaknesses;
  readonly behavioralPatterns: BehavioralPatterns;
  readonly lastUpdated: Date;
}

/**
 * Creates an initial user profile for new users
 */
export function createInitialUserProfile(id: string): UserProfile {
  return {
    id,
    currentLevel: 1,
    totalSessions: 0,
    totalTrainingTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    preferences: {
      preferredTimeOfDay: null,
      averageSessionDuration: 0,
      preferredMode: null,
      sessionsPerWeek: 0,
    },
    trends: {
      overallTrend: 'stable',
      positionTrend: 'stable',
      audioTrend: 'stable',
      recentAccuracies: [],
    },
    strengthsWeaknesses: {
      strongerModality: 'balanced',
      consistentlyStrugglesAt: null,
      consistentlyExcelsAt: null,
    },
    behavioralPatterns: {
      respondsQuicklyToPosition: false,
      respondsQuicklyToAudio: false,
      tendsToPressMatchTooOften: false,
      tendsToPressMatchTooRarely: false,
      performsBetterEarlyInSession: false,
      performsBetterLateInSession: false,
    },
    lastUpdated: new Date(),
  };
}

/**
 * Generates a summary of the user profile for LLM consumption
 */
export function generateProfileSummary(profile: UserProfile): string {
  const lines: string[] = [];

  lines.push(`Current N-back level: ${profile.currentLevel}`);
  lines.push(`Total sessions: ${profile.totalSessions}`);
  lines.push(`Training streak: ${profile.currentStreak} days`);

  if (profile.trends.overallTrend !== 'stable') {
    lines.push(`Performance trend: ${profile.trends.overallTrend}`);
  }

  if (profile.strengthsWeaknesses.strongerModality !== 'balanced') {
    lines.push(`Stronger at: ${profile.strengthsWeaknesses.strongerModality} tasks`);
  }

  if (profile.behavioralPatterns.tendsToPressMatchTooOften) {
    lines.push('Tendency: Over-reports matches (false alarms)');
  } else if (profile.behavioralPatterns.tendsToPressMatchTooRarely) {
    lines.push('Tendency: Under-reports matches (misses)');
  }

  if (profile.preferences.preferredTimeOfDay) {
    lines.push(`Prefers training: ${profile.preferences.preferredTimeOfDay}`);
  }

  return lines.join('\n');
}
