import { N as NBackLevel, T as TrainingMode } from '../TrainingMode-CQj03MGg.mjs';
import { P as PerformanceStats, b as SessionResult, A as AnalyticsEvent } from '../IAnalyticsRepository-dbLgTcrS.mjs';
import { U as UserProgress } from '../IProgressRepository-CXwBdf0T.mjs';
import { U as UserProfile } from '../UserProfile-Cuxx73iE.mjs';

/**
 * SequenceGenerator Service
 *
 * Generates pseudo-random sequences for training sessions.
 * Ensures appropriate match frequency based on N-back level.
 * Supports seeded RNG for reproducible sequences.
 */

/**
 * Configuration for sequence generation
 */
interface SequenceConfig {
    /** N-back level (1-9) */
    nBack: NBackLevel;
    /** Number of trials to generate */
    trialCount: number;
    /** Training mode */
    mode: TrainingMode;
    /** Probability of position match (default: 0.3) */
    positionMatchProbability?: number;
    /** Probability of audio match (default: 0.3) */
    audioMatchProbability?: number;
    /** Optional seed for reproducible sequences */
    seed?: number;
}
/**
 * Represents a generated trial in the sequence
 */
interface GeneratedTrial {
    /** Position index (0-8) for 3x3 grid */
    position: number;
    /** Letter to speak */
    audioLetter: string;
    /** Whether this trial is a position match */
    isPositionMatch: boolean;
    /** Whether this trial is an audio match */
    isAudioMatch: boolean;
}
/**
 * SequenceGenerator
 *
 * Generates training sequences with controlled match probabilities.
 * Prevents consecutive matches and uses phonetically distinct letters.
 */
declare class SequenceGenerator {
    /**
     * Available letters for audio stimuli
     * Phonetically distinct to avoid confusion when spoken
     * Excludes similar-sounding pairs (B/D, C/E, F/S, M/N, P/B, etc.)
     */
    private static readonly LETTERS;
    /** Number of positions in the 3x3 grid */
    private static readonly GRID_SIZE;
    /** Default match probability */
    private static readonly DEFAULT_MATCH_PROBABILITY;
    /**
     * Generates a sequence of trials based on the provided configuration
     */
    generate(config: SequenceConfig): GeneratedTrial[];
    /**
     * Checks if there was a match in the most recent trial
     * Used to prevent consecutive matches which create predictable patterns
     */
    private wasRecentMatch;
    /**
     * Generates a random position, excluding the specified position
     */
    private randomPositionExcluding;
    /**
     * Generates a random letter, excluding the specified letter
     */
    private randomLetterExcluding;
    /**
     * Returns the available letters used for audio stimuli
     */
    static getAvailableLetters(): readonly string[];
    /**
     * Returns the grid size (number of positions)
     */
    static getGridSize(): number;
}
/**
 * Factory function to create a SequenceGenerator instance
 */
declare function createSequenceGenerator(): SequenceGenerator;

/**
 * ScoringService
 *
 * Calculates performance metrics including accuracy and d-prime scores.
 * Uses signal detection theory for cognitive assessment.
 */

/**
 * Represents a single trial result for scoring
 */
interface TrialResult {
    /** Whether this trial was a match (signal) */
    isMatch: boolean;
    /** Whether the user responded (claimed match) */
    userResponse: boolean | null;
    /** Response time in milliseconds (null if no response) */
    responseTime: number | null;
}
/**
 * Dual trial result for position and audio
 */
interface DualTrialResult {
    position: TrialResult;
    audio: TrialResult;
}
/**
 * Combined session result with separate position/audio stats
 */
interface SessionScoringResult {
    /** Position performance stats */
    positionStats: PerformanceStats;
    /** Audio performance stats */
    audioStats: PerformanceStats;
    /** Combined accuracy (mode-dependent weighting) */
    combinedAccuracy: number;
    /** Combined d-prime */
    combinedDPrime: number;
}
/**
 * ScoringService
 *
 * Provides methods for calculating performance statistics from trial results.
 * Handles edge cases and uses signal detection theory metrics.
 */
declare class ScoringService {
    /**
     * Calculate performance statistics from a set of trial results
     */
    calculateStats(trials: TrialResult[]): PerformanceStats;
    /**
     * Calculate performance statistics with log-linear correction
     * This version applies correction for extreme rates (0 or 1)
     * to prevent infinite d-prime values
     */
    calculateStatsWithCorrection(trials: TrialResult[]): PerformanceStats;
    /**
     * Calculate d-prime using inverse normal CDF
     * d' = Z(hitRate) - Z(falseAlarmRate)
     */
    calculateDPrime(hitRate: number, falseAlarmRate: number): number;
    /**
     * Approximate inverse normal CDF (probit function)
     * Using Abramowitz and Stegun approximation
     */
    private inverseNormalCDF;
    /**
     * Calculate full session result from position and audio trials
     */
    calculateSessionResult(positionTrials: TrialResult[], audioTrials: TrialResult[], mode: TrainingMode): SessionScoringResult;
    /**
     * Calculate session result from dual trial results
     */
    calculateDualSessionResult(trials: DualTrialResult[], mode: TrainingMode): SessionScoringResult;
    /**
     * Determine performance level based on d-prime
     * Used for progression decisions
     */
    getPerformanceLevel(dPrime: number): 'poor' | 'fair' | 'good' | 'excellent';
    /**
     * Check if performance meets advancement criteria
     * Default threshold is d-prime >= 2.0
     */
    meetsAdvancementCriteria(dPrime: number, threshold?: number): boolean;
}
/**
 * Factory function to create a ScoringService instance
 */
declare function createScoringService(): ScoringService;

/**
 * ProgressionService
 *
 * Manages level progression and unlocking logic.
 * Determines when users can advance to higher N-back levels.
 */
interface ProgressionService {
    checkProgression(): void;
}

/**
 * ProfileAnalyzer Service
 *
 * Analyzes user behavior patterns across sessions.
 * Builds user profiles for personalized feedback and LLM recommendations.
 */

/**
 * Error pattern identified in user behavior
 */
interface ErrorPattern {
    type: 'position_miss' | 'audio_miss' | 'position_false_alarm' | 'audio_false_alarm';
    frequency: number;
    context: string;
}
/**
 * Fatigue indicator detected in session performance
 */
interface FatigueIndicator {
    type: 'accuracy_drop' | 'response_slowdown' | 'error_spike';
    typicalOnset: number;
    severity: 'mild' | 'moderate' | 'severe';
}
/**
 * Comprehensive behavioral profile for LLM consumption
 */
interface UserBehavioralProfile {
    performance: {
        averageAccuracy: number;
        accuracyTrend: 'improving' | 'stable' | 'declining';
        averageResponseTime: number;
        responseTimeTrend: 'faster' | 'stable' | 'slower';
        positionStrength: number;
        audioStrength: number;
        commonErrorPatterns: ErrorPattern[];
        fatigueIndicators: FatigueIndicator[];
    };
    learning: {
        currentLevel: string;
        progressionRate: 'fast' | 'normal' | 'slow';
        levelsCompleted: number;
        averageAttemptsPerLevel: number;
        plateauDetected: boolean;
        plateauDuration: number | null;
        recommendedNextLevel: string | null;
    };
    engagement: {
        totalSessions: number;
        sessionsThisWeek: number;
        averageSessionsPerWeek: number;
        preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | null;
        averageSessionDuration: number;
        currentStreak: number;
        longestStreak: number;
        lastSessionDate: Date | null;
        daysSinceLastSession: number | null;
    };
    helpSeeking: {
        popoverViewCount: number;
        averagePopoverDuration: number;
        tourCompleted: boolean;
        frequentlyViewedHelp: string[];
        helpViewTrend: 'increasing' | 'stable' | 'decreasing';
    };
    insights: {
        strengths: string[];
        areasForImprovement: string[];
        motivationalFactors: string[];
        riskOfChurn: 'low' | 'medium' | 'high';
        suggestedInterventions: string[];
    };
    profileGeneratedAt: Date;
    dataPointCount: number;
}
/**
 * ProfileAnalyzer Service
 *
 * Builds comprehensive user behavioral profiles from session and analytics data.
 */
declare class ProfileAnalyzer {
    /**
     * Build a comprehensive behavioral profile
     */
    buildBehavioralProfile(sessions: SessionResult[], progress: UserProgress, events: AnalyticsEvent[]): UserBehavioralProfile;
    /**
     * Build a simplified UserProfile (for existing interface compatibility)
     */
    buildUserProfile(sessions: SessionResult[], progress: UserProgress, events: AnalyticsEvent[]): UserProfile;
    private analyzePerformance;
    private getDefaultPerformance;
    private extractResponseTimes;
    private findErrorPatterns;
    private detectFatigue;
    private calculateTrialAccuracy;
    private analyzeLearning;
    private getLevelHistory;
    private calculateProgressionRate;
    private calculateAverageAttempts;
    private detectPlateau;
    private recommendNextLevel;
    private analyzeEngagement;
    private calculateWeeklyAverage;
    private detectPreferredTime;
    private analyzeHelpSeeking;
    private findFrequentHelp;
    private calculateHelpTrend;
    private generateInsights;
    private assessChurnRisk;
    private average;
    private calculateVariance;
    private calculateTrend;
    private calculateResponseTimeTrend;
    private extractNBackLevel;
    private determineStrongerModality;
    private checkFalseAlarmTendency;
    private checkMissTendency;
    private checkEarlyPerformance;
    private checkLatePerformance;
}
/**
 * Factory function to create a ProfileAnalyzer instance
 */
declare function createProfileAnalyzer(): ProfileAnalyzer;

/**
 * RecommendationEngine Service
 *
 * Generates training recommendations based on performance.
 * Suggests optimal level and session timing.
 */
interface RecommendationEngine {
    recommend(): void;
}

export { type DualTrialResult, type ErrorPattern, type FatigueIndicator, type GeneratedTrial, ProfileAnalyzer, type ProgressionService, type RecommendationEngine, ScoringService, type SequenceConfig, SequenceGenerator, type SessionScoringResult, type TrialResult, type UserBehavioralProfile, createProfileAnalyzer, createScoringService, createSequenceGenerator };
