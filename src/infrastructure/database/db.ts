'use client';

/**
 * Dexie Database Configuration
 *
 * Defines the IndexedDB schema for the Neuralift application.
 * Uses Dexie.js for a clean, typed IndexedDB interface.
 */

import Dexie, { type Table } from 'dexie';

/**
 * Session record stored in the database
 */
export interface DBSession {
  /** Unique session identifier */
  sessionId: string;
  /** Level identifier (e.g., "position-2back") */
  levelId: string;
  /** Training mode: single-position, single-audio, or dual */
  mode: string;
  /** N-back level (1-9) */
  nBack: number;
  /** When the session started */
  timestamp: Date;
  /** Session duration in milliseconds */
  duration: number;
  /** JSON stringified TrialData[] */
  trials: string;
  /** JSON stringified PerformanceStats for position */
  positionStats: string;
  /** JSON stringified PerformanceStats for audio */
  audioStats: string;
  /** Combined accuracy percentage */
  combinedAccuracy: number;
  /** Whether the session was completed (not abandoned) */
  completed: boolean;
}

/**
 * User progress record (singleton - always id=1)
 */
export interface DBProgress {
  /** Always 1 - singleton record */
  id: number;
  /** Current level identifier */
  currentLevel: string;
  /** JSON stringified array of unlocked level IDs */
  unlockedLevels: string;
  /** Total number of completed sessions */
  totalSessions: number;
  /** Total training time in milliseconds */
  totalTime: number;
  /** Current consecutive day streak */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** ISO date string of last session, null if never */
  lastSessionDate: string | null;
  /** When this record was last updated */
  updated: Date;
}

/**
 * Analytics event record for tracking user behavior
 */
export interface DBAnalyticsEvent {
  /** Auto-incremented ID */
  id?: number;
  /** Event type (e.g., "SESSION_STARTED", "LEVEL_UNLOCKED") */
  type: string;
  /** Event category for grouping */
  category: string;
  /** Associated session ID, if any */
  sessionId: string | null;
  /** When the event occurred */
  timestamp: Date;
  /** JSON stringified event payload */
  payload: string;
}

/**
 * User settings record (singleton - always id=1)
 */
export interface DBSettings {
  /** Always 1 - singleton record */
  id: number;
  /** Duration of each trial in milliseconds */
  trialDuration: number;
  /** Number of trials per session */
  sessionLength: number;
  /** Whether adaptive difficulty is enabled */
  adaptiveMode: boolean;
  /** Show recent history helper during training */
  showHistoryHelper: boolean;
  /** Show briefing before each session */
  showBriefing: boolean;
  /** Whether sound effects are enabled */
  soundEnabled: boolean;
  /** Volume level (0-100) */
  volume: number;
  /** When settings were last updated */
  updated: Date;
}

/**
 * Default progress values for new users
 */
const DEFAULT_PROGRESS: Omit<DBProgress, 'id'> = {
  currentLevel: 'position-1back',
  unlockedLevels: JSON.stringify(['position-1back', 'audio-1back']),
  totalSessions: 0,
  totalTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  updated: new Date(),
};

/**
 * Default settings for new users
 */
const DEFAULT_SETTINGS: Omit<DBSettings, 'id'> = {
  trialDuration: 3000,
  sessionLength: 20,
  adaptiveMode: false,
  showHistoryHelper: true,
  showBriefing: true,
  soundEnabled: true,
  volume: 80,
  updated: new Date(),
};

/**
 * Neuralift Database
 *
 * Extends Dexie to provide typed tables for the application.
 */
export class NeuraliftDB extends Dexie {
  sessions!: Table<DBSession, string>;
  progress!: Table<DBProgress, number>;
  analyticsEvents!: Table<DBAnalyticsEvent, number>;
  settings!: Table<DBSettings, number>;

  constructor() {
    super('neuralift');

    // Define database schema
    // Keys: primary key first, then indexed fields
    this.version(1).stores({
      sessions: 'sessionId, levelId, timestamp, completed',
      progress: 'id',
      analyticsEvents: '++id, type, category, sessionId, timestamp',
      settings: 'id',
    });
  }

  /**
   * Initialize default records if they don't exist
   * Call this when the app starts
   */
  async initialize(): Promise<void> {
    // Initialize progress if not exists
    const progressExists = await this.progress.get(1);
    if (!progressExists) {
      await this.progress.add({
        id: 1,
        ...DEFAULT_PROGRESS,
        updated: new Date(),
      });
    }

    // Initialize settings if not exists
    const settingsExists = await this.settings.get(1);
    if (!settingsExists) {
      await this.settings.add({
        id: 1,
        ...DEFAULT_SETTINGS,
        updated: new Date(),
      });
    }
  }

  /**
   * Get recent sessions, optionally filtered by level
   */
  async getRecentSessions(limit = 10, levelId?: string): Promise<DBSession[]> {
    let query = this.sessions.orderBy('timestamp').reverse();

    if (levelId) {
      query = this.sessions.where('levelId').equals(levelId).reverse();
    }

    return query.limit(limit).toArray();
  }

  /**
   * Get sessions in a date range
   */
  async getSessionsInRange(startDate: Date, endDate: Date): Promise<DBSession[]> {
    return this.sessions
      .where('timestamp')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  /**
   * Get analytics events by type
   */
  async getAnalyticsEventsByType(
    type: string,
    limit = 100
  ): Promise<DBAnalyticsEvent[]> {
    return this.analyticsEvents
      .where('type')
      .equals(type)
      .reverse()
      .limit(limit)
      .toArray();
  }
}

/**
 * Singleton database instance
 * Use this throughout the application
 */
export const db = new NeuraliftDB();
