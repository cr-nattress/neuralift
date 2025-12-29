/**
 * ISessionRepository Port
 *
 * Interface for persisting and retrieving training sessions.
 * Works with SessionResult for storage (serializable) rather than Session entities.
 */

import type { SessionResult } from '../domain/entities/Session';

export interface ISessionRepository {
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
