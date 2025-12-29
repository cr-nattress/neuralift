/**
 * Analytics Event Types
 *
 * Strongly-typed event definitions for the analytics system.
 * Used for user profiling and LLM-powered recommendations.
 */

import type { EventCategory } from '../../ports/IAnalyticsRepository';
import type { TrainingMode } from '../value-objects/TrainingMode';
import type { NBackLevel } from '../value-objects/NBackLevel';

/**
 * Base interface for all analytics events
 */
export interface BaseAnalyticsEvent<T extends string, C extends EventCategory, P> {
  type: T;
  category: C;
  sessionId?: string;
  timestamp: Date;
  payload: P;
}

// ============================================================================
// Session Events
// ============================================================================

export interface SessionStartedPayload {
  sessionId: string;
  levelId: string;
  nBack: NBackLevel;
  mode: TrainingMode;
  trialCount: number;
}

export type SessionStartedEvent = BaseAnalyticsEvent<
  'SESSION_STARTED',
  'session',
  SessionStartedPayload
>;

export interface SessionCompletedPayload {
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

export type SessionCompletedEvent = BaseAnalyticsEvent<
  'SESSION_COMPLETED',
  'session',
  SessionCompletedPayload
>;

export interface SessionAbandonedPayload {
  sessionId: string;
  completedTrials: number;
  totalTrials: number;
  reason: 'user_quit' | 'navigation' | 'error';
}

export type SessionAbandonedEvent = BaseAnalyticsEvent<
  'SESSION_ABANDONED',
  'session',
  SessionAbandonedPayload
>;

export interface SessionPausedPayload {
  sessionId: string;
  trialIndex: number;
}

export type SessionPausedEvent = BaseAnalyticsEvent<
  'SESSION_PAUSED',
  'session',
  SessionPausedPayload
>;

export interface SessionResumedPayload {
  sessionId: string;
  trialIndex: number;
  pauseDuration: number;
}

export type SessionResumedEvent = BaseAnalyticsEvent<
  'SESSION_RESUMED',
  'session',
  SessionResumedPayload
>;

// ============================================================================
// Trial Events
// ============================================================================

export interface TrialCompletedPayload {
  sessionId: string;
  trialIndex: number;
  positionCorrect: boolean | null;
  audioCorrect: boolean | null;
  positionResponseTime: number | null;
  audioResponseTime: number | null;
  wasPositionMatch: boolean;
  wasAudioMatch: boolean;
}

export type TrialCompletedEvent = BaseAnalyticsEvent<
  'TRIAL_COMPLETED',
  'trial',
  TrialCompletedPayload
>;

// ============================================================================
// Navigation Events
// ============================================================================

export interface PageViewedPayload {
  page: string;
  referrer: string | null;
  timeOnPreviousPage: number | null;
}

export type PageViewedEvent = BaseAnalyticsEvent<'PAGE_VIEWED', 'navigation', PageViewedPayload>;

// ============================================================================
// Interaction Events
// ============================================================================

export interface ButtonClickedPayload {
  buttonId: string;
  context: string;
}

export type ButtonClickedEvent = BaseAnalyticsEvent<
  'BUTTON_CLICKED',
  'interaction',
  ButtonClickedPayload
>;

export interface LevelSelectedPayload {
  levelId: string;
  previousLevelId: string | null;
}

export type LevelSelectedEvent = BaseAnalyticsEvent<
  'LEVEL_SELECTED',
  'interaction',
  LevelSelectedPayload
>;

// ============================================================================
// Settings Events
// ============================================================================

export interface SettingChangedPayload {
  setting: string;
  oldValue: unknown;
  newValue: unknown;
}

export type SettingChangedEvent = BaseAnalyticsEvent<
  'SETTING_CHANGED',
  'settings',
  SettingChangedPayload
>;

// ============================================================================
// Help Events
// ============================================================================

export interface HelpViewedPayload {
  helpId: string;
  context: string;
  duration: number;
}

export type HelpViewedEvent = BaseAnalyticsEvent<'HELP_VIEWED', 'help', HelpViewedPayload>;

export interface TourStepViewedPayload {
  stepIndex: number;
  stepId: string;
  totalSteps: number;
}

export type TourStepViewedEvent = BaseAnalyticsEvent<
  'TOUR_STEP_VIEWED',
  'help',
  TourStepViewedPayload
>;

export interface TourCompletedPayload {
  totalSteps: number;
  completedSteps: number;
  skipped: boolean;
}

export type TourCompletedEvent = BaseAnalyticsEvent<
  'TOUR_COMPLETED',
  'help',
  TourCompletedPayload
>;

// ============================================================================
// Performance Events
// ============================================================================

export interface LevelProgressPayload {
  levelId: string;
  newBestAccuracy: number;
  previousBestAccuracy: number | null;
  totalAttempts: number;
}

export type LevelProgressEvent = BaseAnalyticsEvent<
  'LEVEL_PROGRESS',
  'performance',
  LevelProgressPayload
>;

export interface LevelUnlockedPayload {
  levelId: string;
  unlockedBy: string;
  accuracy: number;
}

export type LevelUnlockedEvent = BaseAnalyticsEvent<
  'LEVEL_UNLOCKED',
  'performance',
  LevelUnlockedPayload
>;

// ============================================================================
// Engagement Events
// ============================================================================

export interface AppOpenedPayload {
  daysSinceLastVisit: number | null;
  currentStreak: number;
  totalSessions: number;
}

export type AppOpenedEvent = BaseAnalyticsEvent<'APP_OPENED', 'engagement', AppOpenedPayload>;

export interface StreakMilestonePayload {
  streakDays: number;
  milestone: 7 | 14 | 30 | 60 | 100;
}

export type StreakMilestoneEvent = BaseAnalyticsEvent<
  'STREAK_MILESTONE',
  'engagement',
  StreakMilestonePayload
>;

// ============================================================================
// Union Type
// ============================================================================

export type AnalyticsEventType =
  // Session
  | SessionStartedEvent
  | SessionCompletedEvent
  | SessionAbandonedEvent
  | SessionPausedEvent
  | SessionResumedEvent
  // Trial
  | TrialCompletedEvent
  // Navigation
  | PageViewedEvent
  // Interaction
  | ButtonClickedEvent
  | LevelSelectedEvent
  // Settings
  | SettingChangedEvent
  // Help
  | HelpViewedEvent
  | TourStepViewedEvent
  | TourCompletedEvent
  // Performance
  | LevelProgressEvent
  | LevelUnlockedEvent
  // Engagement
  | AppOpenedEvent
  | StreakMilestoneEvent;

/**
 * Helper type to get payload type from event type string
 */
export type PayloadForEventType<T extends AnalyticsEventType['type']> = Extract<
  AnalyticsEventType,
  { type: T }
>['payload'];
