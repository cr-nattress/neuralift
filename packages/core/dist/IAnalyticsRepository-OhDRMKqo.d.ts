import { N as NBackLevel, T as TrainingMode } from './TrainingMode-CQj03MGg.js';

/**
 * Position Value Object
 *
 * Represents a position in the 3x3 training grid.
 * Provides utilities for position manipulation and comparison.
 */
/**
 * Position index type (0-8 for 3x3 grid)
 */
type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/**
 * Position with row and column coordinates
 */
interface Position {
    readonly row: number;
    readonly col: number;
    readonly index: PositionIndex;
}
/**
 * Validates if a number is a valid position index
 */
declare function isValidPositionIndex(value: number): value is PositionIndex;
/**
 * Creates a Position from an index (0-8)
 */
declare function createPosition(index: number): Position;
/**
 * Creates a Position from row and column coordinates
 */
declare function createPositionFromCoords(row: number, col: number): Position;
/**
 * Checks if two positions are equal
 */
declare function positionsEqual(a: Position, b: Position): boolean;
/**
 * Gets all valid position indices
 */
declare function getAllPositionIndices(): readonly PositionIndex[];
/**
 * Gets a random position index
 */
declare function getRandomPositionIndex(): PositionIndex;

/**
 * Trial Entity
 *
 * Represents a single trial in a training session.
 * Uses immutable pattern - methods return new Trial instances.
 */

/**
 * Raw trial data for serialization
 */
interface TrialData {
    readonly id: number;
    readonly position: PositionIndex;
    readonly audioLetter: string;
    readonly isPositionMatch: boolean;
    readonly isAudioMatch: boolean;
    readonly userPositionResponse: boolean | null;
    readonly userAudioResponse: boolean | null;
    readonly positionResponseTime: number | null;
    readonly audioResponseTime: number | null;
    readonly stimulusTimestamp: number;
}
/**
 * Immutable Trial entity
 */
declare class Trial {
    private readonly data;
    private constructor();
    /**
     * Creates a new Trial
     */
    static create(id: number, position: PositionIndex, audioLetter: string, isPositionMatch: boolean, isAudioMatch: boolean): Trial;
    /**
     * Creates a Trial from existing data (for deserialization)
     */
    static fromData(data: TrialData): Trial;
    get id(): number;
    get position(): PositionIndex;
    get audioLetter(): string;
    get isPositionMatch(): boolean;
    get isAudioMatch(): boolean;
    get userPositionResponse(): boolean | null;
    get userAudioResponse(): boolean | null;
    get positionResponseTime(): number | null;
    get audioResponseTime(): number | null;
    get stimulusTimestamp(): number;
    /**
     * Records a position response, returning a new Trial instance
     */
    recordPositionResponse(response: boolean): Trial;
    /**
     * Records an audio response, returning a new Trial instance
     */
    recordAudioResponse(response: boolean): Trial;
    /**
     * Checks if position response was correct
     */
    isPositionCorrect(): boolean;
    /**
     * Checks if audio response was correct
     */
    isAudioCorrect(): boolean;
    /**
     * Gets position response category for stats calculation
     */
    getPositionCategory(): 'hit' | 'miss' | 'falseAlarm' | 'correctRejection';
    /**
     * Gets audio response category for stats calculation
     */
    getAudioCategory(): 'hit' | 'miss' | 'falseAlarm' | 'correctRejection';
    /**
     * Checks if any response has been recorded
     */
    hasResponse(): boolean;
    /**
     * Serializes the trial to JSON
     */
    toJSON(): TrialData;
}

/**
 * PerformanceStats Value Object
 *
 * Represents performance metrics for a session or trial set.
 * Uses signal detection theory metrics (d-prime) for cognitive assessment.
 */
/**
 * Performance statistics calculated from session trials
 */
interface PerformanceStats {
    /** Number of correct match identifications (hits) */
    readonly hits: number;
    /** Number of missed matches (misses) */
    readonly misses: number;
    /** Number of incorrect match claims (false alarms) */
    readonly falseAlarms: number;
    /** Number of correctly identified non-matches */
    readonly correctRejections: number;
    /** Hit rate: hits / (hits + misses) */
    readonly hitRate: number;
    /** False alarm rate: falseAlarms / (falseAlarms + correctRejections) */
    readonly falseAlarmRate: number;
    /** D-prime: sensitivity measure from signal detection theory */
    readonly dPrime: number;
    /** Overall accuracy percentage (0-100) */
    readonly accuracy: number;
    /** Average response time in milliseconds (null if no responses) */
    readonly avgResponseTime: number | null;
}
/**
 * Raw counts for calculating performance stats
 */
interface PerformanceRawCounts {
    hits: number;
    misses: number;
    falseAlarms: number;
    correctRejections: number;
    responseTimes: number[];
}
/**
 * Creates PerformanceStats from raw counts
 */
declare function createPerformanceStats(counts: PerformanceRawCounts): PerformanceStats;
/**
 * Creates empty performance stats (for initial state)
 */
declare function createEmptyPerformanceStats(): PerformanceStats;

/**
 * Session Entity
 *
 * Represents a complete training session consisting of multiple trials.
 * Mutates internally for performance during gameplay.
 */

/**
 * Configuration for creating a session
 */
interface SessionConfig {
    readonly levelId: string;
    readonly nBack: NBackLevel;
    readonly mode: TrainingMode;
    readonly trialCount: number;
    readonly trialDuration: number;
}
/**
 * Result of a completed session
 */
interface SessionResult {
    readonly sessionId: string;
    readonly levelId: string;
    readonly mode: TrainingMode;
    readonly nBack: NBackLevel;
    readonly timestamp: Date;
    readonly duration: number;
    readonly trials: TrialData[];
    readonly positionStats: PerformanceStats;
    readonly audioStats: PerformanceStats;
    readonly combinedAccuracy: number;
    readonly completed: boolean;
}
/**
 * Session progress information
 */
interface SessionProgress {
    readonly current: number;
    readonly total: number;
    readonly percentage: number;
}
/**
 * Session entity - manages training session state
 */
declare class Session {
    private readonly sessionId;
    private readonly config;
    private trials;
    private currentTrialIndex;
    private startTime;
    private endTime;
    private isCompleted;
    constructor(sessionId: string, config: SessionConfig, trials: Trial[]);
    /**
     * Starts the session
     */
    start(): void;
    /**
     * Gets the session ID
     */
    getId(): string;
    /**
     * Gets the session configuration
     */
    getConfig(): SessionConfig;
    /**
     * Gets the current trial, or null if session is complete
     */
    getCurrentTrial(): Trial | null;
    /**
     * Gets the current trial index
     */
    getCurrentTrialIndex(): number;
    /**
     * Records a position response for the current trial
     */
    recordPositionResponse(response: boolean): void;
    /**
     * Records an audio response for the current trial
     */
    recordAudioResponse(response: boolean): void;
    /**
     * Advances to the next trial
     * @returns true if there are more trials, false if session is complete
     */
    advanceToNextTrial(): boolean;
    /**
     * Completes the session and returns results
     */
    complete(): SessionResult;
    /**
     * Gets session progress
     */
    getProgress(): SessionProgress;
    /**
     * Checks if the session is complete
     */
    isSessionComplete(): boolean;
    /**
     * Gets all trials
     */
    getTrials(): readonly Trial[];
    private calculatePositionStats;
    private calculateAudioStats;
    private calculateCombinedAccuracy;
    /**
     * Serializes session to result format
     */
    toJSON(): SessionResult;
}

/**
 * IAnalyticsRepository Port
 *
 * Interface for persisting analytics and behavioral events.
 * Used for user profiling and LLM-powered recommendations.
 */
/**
 * Event category types
 */
type EventCategory = 'session' | 'trial' | 'navigation' | 'interaction' | 'settings' | 'help' | 'performance' | 'engagement';
/**
 * Analytics event structure
 */
interface AnalyticsEvent {
    /** Event type identifier */
    type: string;
    /** Event category for grouping */
    category: EventCategory;
    /** Associated session ID, if applicable */
    sessionId?: string;
    /** When the event occurred */
    timestamp: Date;
    /** Event-specific payload data */
    payload: Record<string, unknown>;
}
interface IAnalyticsRepository {
    /**
     * Track a single analytics event
     */
    trackEvent(event: AnalyticsEvent): Promise<void>;
    /**
     * Track multiple events in batch (more efficient)
     */
    trackEvents(events: AnalyticsEvent[]): Promise<void>;
    /**
     * Get events by category
     */
    getEventsByCategory(category: EventCategory): Promise<AnalyticsEvent[]>;
    /**
     * Get events for a specific session
     */
    getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]>;
    /**
     * Get events by type
     */
    getEventsByType(type: string): Promise<AnalyticsEvent[]>;
    /**
     * Get recent events
     */
    getRecentEvents(limit: number): Promise<AnalyticsEvent[]>;
    /**
     * Get events since a specific date
     */
    getEventsSince(since: Date): Promise<AnalyticsEvent[]>;
    /**
     * Get total event count
     */
    getEventCount(): Promise<number>;
    /**
     * Clear all events
     */
    clear(): Promise<void>;
    /**
     * Clear events older than a specific date
     * Returns the number of deleted events
     */
    clearOlderThan(date: Date): Promise<number>;
}

export { type AnalyticsEvent as A, type EventCategory as E, type IAnalyticsRepository as I, type PerformanceStats as P, type SessionConfig as S, type TrialData as T, Trial as a, type SessionResult as b, type SessionProgress as c, Session as d, type PerformanceRawCounts as e, createPerformanceStats as f, createEmptyPerformanceStats as g, type PositionIndex as h, type Position as i, isValidPositionIndex as j, createPosition as k, createPositionFromCoords as l, getAllPositionIndices as m, getRandomPositionIndex as n, positionsEqual as p };
