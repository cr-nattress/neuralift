/**
 * IAnalyticsRepository Port
 *
 * Interface for persisting analytics and behavioral events.
 * Used for user profiling and LLM-powered recommendations.
 */

/**
 * Event category types
 */
export type EventCategory =
  | 'session'
  | 'trial'
  | 'navigation'
  | 'interaction'
  | 'settings'
  | 'help'
  | 'performance'
  | 'engagement';

/**
 * Analytics event structure
 */
export interface AnalyticsEvent {
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

export interface IAnalyticsRepository {
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
