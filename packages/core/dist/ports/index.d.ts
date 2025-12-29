import { b as SessionResult } from '../IAnalyticsRepository-OhDRMKqo.js';
export { A as AnalyticsEvent, E as EventCategory, I as IAnalyticsRepository } from '../IAnalyticsRepository-OhDRMKqo.js';
export { I as IProgressRepository, U as UserProgress } from '../IProgressRepository-CXwBdf0T.js';
import { U as UserProfile } from '../UserProfile-DlU5DO_m.js';
import { D as DomainEvent } from '../DomainEvent-DmM7d3r0.js';
import '../TrainingMode-CQj03MGg.js';

/**
 * ISessionRepository Port
 *
 * Interface for persisting and retrieving training sessions.
 * Works with SessionResult for storage (serializable) rather than Session entities.
 */

interface ISessionRepository {
    /**
     * Save a session result to storage
     */
    save(session: SessionResult): Promise<void>;
    /**
     * Find a session by its ID
     */
    findById(sessionId: string): Promise<SessionResult | null>;
    /**
     * Find all sessions for a specific level
     */
    findByLevel(levelId: string): Promise<SessionResult[]>;
    /**
     * Find recent sessions, sorted by date descending
     */
    findRecent(limit: number): Promise<SessionResult[]>;
    /**
     * Find sessions within a date range
     */
    findByDateRange(start: Date, end: Date): Promise<SessionResult[]>;
    /**
     * Get total count of sessions
     */
    count(): Promise<number>;
    /**
     * Delete all sessions
     */
    clear(): Promise<void>;
}

/**
 * IAudioPlayer Port
 *
 * Interface for audio playback functionality.
 * Implementations handle letter pronunciation and feedback sounds.
 */
type FeedbackSoundType = 'correct' | 'incorrect' | 'tick' | 'complete';
interface IAudioPlayer {
    /**
     * Initialize the audio player and preload sounds
     */
    initialize(): Promise<void>;
    /**
     * Play a letter sound
     */
    playLetter(letter: string): Promise<void>;
    /**
     * Play a feedback sound
     */
    playFeedback(type: FeedbackSoundType): Promise<void>;
    /**
     * Preload specific letters for faster playback
     */
    preload(letters: string[]): Promise<void>;
    /**
     * Set the master volume (0-100)
     */
    setVolume(volume: number): void;
    /**
     * Get the current volume (0-100)
     */
    getVolume(): number;
    /**
     * Mute all audio
     */
    mute(): void;
    /**
     * Unmute audio
     */
    unmute(): void;
    /**
     * Check if audio is muted
     */
    isMuted(): boolean;
    /**
     * Stop all currently playing sounds
     */
    stop(): void;
    /**
     * Clean up and release audio resources
     */
    destroy(): void;
}

/**
 * ILLMService Port
 *
 * Interface for LLM-powered personalized feedback generation.
 */

/**
 * Response from the LLM feedback generation
 */
interface LLMFeedbackResponse {
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
interface FeedbackContext {
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
interface TrainingRecommendation {
    /** Recommended level to practice */
    recommendedLevel: string;
    /** Reason for the recommendation */
    reason: string;
    /** Priority (1 = highest) */
    priority: number;
}
interface ILLMService {
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

/**
 * IEventBus Port
 *
 * Interface for domain event publishing and subscription.
 */

interface IEventBus {
    publish(event: DomainEvent): void;
    subscribe<T extends DomainEvent>(eventType: string, handler: (event: T) => void): () => void;
}

export type { FeedbackContext, FeedbackSoundType, IAudioPlayer, IEventBus, ILLMService, ISessionRepository, LLMFeedbackResponse, TrainingRecommendation };
