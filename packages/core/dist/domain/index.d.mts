import { E as EventCategory } from '../IAnalyticsRepository-dbLgTcrS.mjs';
export { e as PerformanceRawCounts, P as PerformanceStats, i as Position, h as PositionIndex, d as Session, S as SessionConfig, c as SessionProgress, b as SessionResult, a as Trial, T as TrialData, g as createEmptyPerformanceStats, f as createPerformanceStats, k as createPosition, l as createPositionFromCoords, m as getAllPositionIndices, n as getRandomPositionIndex, j as isValidPositionIndex, p as positionsEqual } from '../IAnalyticsRepository-dbLgTcrS.mjs';
import { N as NBackLevel, T as TrainingMode } from '../TrainingMode-CQj03MGg.mjs';
export { a as TRAINING_MODES, c as createNBackLevel, g as getTrainingModeName, i as isValidNBackLevel, b as isValidTrainingMode, d as modeIncludesAudio, m as modeIncludesPosition } from '../TrainingMode-CQj03MGg.mjs';
export { B as BehavioralPatterns, P as PerformanceTrends, S as StrengthsWeaknesses, T as TrainingPreferences, U as UserProfile, c as createInitialUserProfile, g as generateProfileSummary } from '../UserProfile-Cuxx73iE.mjs';
import { D as DomainEvent } from '../DomainEvent-DmM7d3r0.mjs';

/**
 * Level Entity
 *
 * Represents a training level configuration.
 * Defines N-back difficulty and mode settings.
 */

/**
 * Criteria for unlocking a level
 */
interface UnlockCriteria {
    readonly requiredLevel: string;
    readonly minAccuracy: number;
}
/**
 * Level configuration
 */
interface Level {
    readonly id: string;
    readonly name: string;
    readonly nBack: NBackLevel;
    readonly mode: TrainingMode;
    readonly description: string;
    readonly unlockCriteria?: UnlockCriteria;
}
/**
 * User progress on a specific level
 */
interface LevelProgress {
    readonly levelId: string;
    readonly bestAccuracy: number;
    readonly totalSessions: number;
    readonly lastPlayedAt: Date | null;
    readonly unlocked: boolean;
}
/**
 * Creates a Level from configuration
 */
declare function createLevel(id: string, name: string, nBack: NBackLevel, mode: TrainingMode, description: string, unlockCriteria?: UnlockCriteria): Level;
/**
 * Checks if a level requires unlocking
 */
declare function levelRequiresUnlock(level: Level): boolean;
/**
 * Checks if unlock criteria are met
 */
declare function isLevelUnlockCriteriaMet(level: Level, levelProgresses: Map<string, LevelProgress>): boolean;

/**
 * SessionStarted Event
 *
 * Emitted when a new training session begins.
 */

interface SessionStarted extends DomainEvent {
    readonly type: 'SESSION_STARTED';
    readonly levelId: string;
}

/**
 * SessionCompleted Event
 *
 * Emitted when a training session is completed.
 */

interface SessionCompleted extends DomainEvent {
    readonly type: 'SESSION_COMPLETED';
    readonly levelId: string;
    readonly accuracy: number;
    readonly duration: number;
}
/**
 * Creates a SessionCompleted event
 */
declare function createSessionCompletedEvent(aggregateId: string, levelId: string, accuracy: number, duration: number): SessionCompleted;

/**
 * TrialCompleted Event
 *
 * Emitted when a trial is completed with a response.
 */

interface TrialCompleted extends DomainEvent {
    readonly type: 'TRIAL_COMPLETED';
    readonly trialId: string;
    readonly correct: boolean;
}

/**
 * LevelUnlocked Event
 *
 * Emitted when a user unlocks a new training level.
 */

interface LevelUnlocked extends DomainEvent {
    readonly type: 'LEVEL_UNLOCKED';
    readonly levelId: string;
}

/**
 * Analytics Event Types
 *
 * Strongly-typed event definitions for the analytics system.
 * Used for user profiling and LLM-powered recommendations.
 */

/**
 * Base interface for all analytics events
 */
interface BaseAnalyticsEvent<T extends string, C extends EventCategory, P> {
    type: T;
    category: C;
    sessionId?: string;
    timestamp: Date;
    payload: P;
}
interface SessionStartedPayload {
    sessionId: string;
    levelId: string;
    nBack: NBackLevel;
    mode: TrainingMode;
    trialCount: number;
}
type SessionStartedEvent = BaseAnalyticsEvent<'SESSION_STARTED', 'session', SessionStartedPayload>;
interface SessionCompletedPayload {
    sessionId: string;
    levelId: string;
    nBack: NBackLevel;
    mode: TrainingMode;
    duration: number;
    accuracy: number;
    positionAccuracy: number;
    audioAccuracy: number;
    dPrimePosition: number;
    dPrimeAudio: number;
}
type SessionCompletedEvent = BaseAnalyticsEvent<'SESSION_COMPLETED', 'session', SessionCompletedPayload>;
interface SessionAbandonedPayload {
    sessionId: string;
    completedTrials: number;
    totalTrials: number;
    reason: 'user_quit' | 'navigation' | 'error';
}
type SessionAbandonedEvent = BaseAnalyticsEvent<'SESSION_ABANDONED', 'session', SessionAbandonedPayload>;
interface SessionPausedPayload {
    sessionId: string;
    trialIndex: number;
}
type SessionPausedEvent = BaseAnalyticsEvent<'SESSION_PAUSED', 'session', SessionPausedPayload>;
interface SessionResumedPayload {
    sessionId: string;
    trialIndex: number;
    pauseDuration: number;
}
type SessionResumedEvent = BaseAnalyticsEvent<'SESSION_RESUMED', 'session', SessionResumedPayload>;
interface TrialCompletedPayload {
    sessionId: string;
    trialIndex: number;
    positionCorrect: boolean | null;
    audioCorrect: boolean | null;
    positionResponseTime: number | null;
    audioResponseTime: number | null;
    wasPositionMatch: boolean;
    wasAudioMatch: boolean;
}
type TrialCompletedEvent = BaseAnalyticsEvent<'TRIAL_COMPLETED', 'trial', TrialCompletedPayload>;
interface PageViewedPayload {
    page: string;
    referrer: string | null;
    timeOnPreviousPage: number | null;
}
type PageViewedEvent = BaseAnalyticsEvent<'PAGE_VIEWED', 'navigation', PageViewedPayload>;
interface ButtonClickedPayload {
    buttonId: string;
    context: string;
}
type ButtonClickedEvent = BaseAnalyticsEvent<'BUTTON_CLICKED', 'interaction', ButtonClickedPayload>;
interface LevelSelectedPayload {
    levelId: string;
    previousLevelId: string | null;
}
type LevelSelectedEvent = BaseAnalyticsEvent<'LEVEL_SELECTED', 'interaction', LevelSelectedPayload>;
interface SettingChangedPayload {
    setting: string;
    oldValue: unknown;
    newValue: unknown;
}
type SettingChangedEvent = BaseAnalyticsEvent<'SETTING_CHANGED', 'settings', SettingChangedPayload>;
interface HelpViewedPayload {
    helpId: string;
    context: string;
    duration: number;
}
type HelpViewedEvent = BaseAnalyticsEvent<'HELP_VIEWED', 'help', HelpViewedPayload>;
interface TourStepViewedPayload {
    stepIndex: number;
    stepId: string;
    totalSteps: number;
}
type TourStepViewedEvent = BaseAnalyticsEvent<'TOUR_STEP_VIEWED', 'help', TourStepViewedPayload>;
interface TourCompletedPayload {
    totalSteps: number;
    completedSteps: number;
    skipped: boolean;
}
type TourCompletedEvent = BaseAnalyticsEvent<'TOUR_COMPLETED', 'help', TourCompletedPayload>;
interface LevelProgressPayload {
    levelId: string;
    newBestAccuracy: number;
    previousBestAccuracy: number | null;
    totalAttempts: number;
}
type LevelProgressEvent = BaseAnalyticsEvent<'LEVEL_PROGRESS', 'performance', LevelProgressPayload>;
interface LevelUnlockedPayload {
    levelId: string;
    unlockedBy: string;
    accuracy: number;
}
type LevelUnlockedEvent = BaseAnalyticsEvent<'LEVEL_UNLOCKED', 'performance', LevelUnlockedPayload>;
interface AppOpenedPayload {
    daysSinceLastVisit: number | null;
    currentStreak: number;
    totalSessions: number;
}
type AppOpenedEvent = BaseAnalyticsEvent<'APP_OPENED', 'engagement', AppOpenedPayload>;
interface StreakMilestonePayload {
    streakDays: number;
    milestone: 7 | 14 | 30 | 60 | 100;
}
type StreakMilestoneEvent = BaseAnalyticsEvent<'STREAK_MILESTONE', 'engagement', StreakMilestonePayload>;
type AnalyticsEventType = SessionStartedEvent | SessionCompletedEvent | SessionAbandonedEvent | SessionPausedEvent | SessionResumedEvent | TrialCompletedEvent | PageViewedEvent | ButtonClickedEvent | LevelSelectedEvent | SettingChangedEvent | HelpViewedEvent | TourStepViewedEvent | TourCompletedEvent | LevelProgressEvent | LevelUnlockedEvent | AppOpenedEvent | StreakMilestoneEvent;
/**
 * Helper type to get payload type from event type string
 */
type PayloadForEventType<T extends AnalyticsEventType['type']> = Extract<AnalyticsEventType, {
    type: T;
}>['payload'];

export { type AnalyticsEventType, type AppOpenedEvent, type AppOpenedPayload, type BaseAnalyticsEvent, type ButtonClickedEvent, type ButtonClickedPayload, DomainEvent, type HelpViewedEvent, type HelpViewedPayload, type Level, type LevelProgress, type LevelProgressEvent, type LevelProgressPayload, type LevelSelectedEvent, type LevelSelectedPayload, type LevelUnlocked, type LevelUnlockedEvent, type LevelUnlockedPayload, NBackLevel, type PageViewedEvent, type PageViewedPayload, type PayloadForEventType, type SessionAbandonedEvent, type SessionAbandonedPayload, type SessionCompleted, type SessionCompletedEvent, type SessionCompletedPayload, type SessionPausedEvent, type SessionPausedPayload, type SessionResumedEvent, type SessionResumedPayload, type SessionStarted, type SessionStartedEvent, type SessionStartedPayload, type SettingChangedEvent, type SettingChangedPayload, type StreakMilestoneEvent, type StreakMilestonePayload, type TourCompletedEvent, type TourCompletedPayload, type TourStepViewedEvent, type TourStepViewedPayload, TrainingMode, type TrialCompleted, type TrialCompletedEvent, type TrialCompletedPayload, type UnlockCriteria, createLevel, createSessionCompletedEvent, isLevelUnlockCriteriaMet, levelRequiresUnlock };
