import { T as TrainingMode, N as NBackLevel } from './TrainingMode-CQj03MGg.mjs';

/**
 * UserProfile Entity
 *
 * Represents aggregated user behavior and preferences.
 * Used for LLM-powered personalized feedback generation.
 */

/**
 * Training preferences derived from user behavior
 */
interface TrainingPreferences {
    readonly preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | null;
    readonly averageSessionDuration: number;
    readonly preferredMode: TrainingMode | null;
    readonly sessionsPerWeek: number;
}
/**
 * Performance trends over time
 */
interface PerformanceTrends {
    readonly overallTrend: 'improving' | 'stable' | 'declining';
    readonly positionTrend: 'improving' | 'stable' | 'declining';
    readonly audioTrend: 'improving' | 'stable' | 'declining';
    readonly recentAccuracies: number[];
}
/**
 * Identified strengths and weaknesses
 */
interface StrengthsWeaknesses {
    readonly strongerModality: 'position' | 'audio' | 'balanced';
    readonly consistentlyStrugglesAt: NBackLevel | null;
    readonly consistentlyExcelsAt: NBackLevel | null;
}
/**
 * Behavioral patterns observed
 */
interface BehavioralPatterns {
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
interface UserProfile {
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
declare function createInitialUserProfile(id: string): UserProfile;
/**
 * Generates a summary of the user profile for LLM consumption
 */
declare function generateProfileSummary(profile: UserProfile): string;

export { type BehavioralPatterns as B, type PerformanceTrends as P, type StrengthsWeaknesses as S, type TrainingPreferences as T, type UserProfile as U, createInitialUserProfile as c, generateProfileSummary as g };
