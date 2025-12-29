'use client';

/**
 * DexieSessionRepository
 *
 * Implements ISessionRepository using Dexie.js for IndexedDB storage.
 */

import type {
  ISessionRepository,
  SessionResult,
  NBackLevel,
  TrainingMode,
  PerformanceStats,
  TrialData,
} from '@neuralift/core';
import { db, type DBSession } from '../database/db';

export class DexieSessionRepository implements ISessionRepository {
  /**
   * Convert SessionResult to database format
   */
  private toDBSession(session: SessionResult): DBSession {
    return {
      sessionId: session.sessionId,
      levelId: session.levelId,
      mode: session.mode,
      nBack: session.nBack,
      timestamp: session.timestamp,
      duration: session.duration,
      trials: JSON.stringify(session.trials),
      positionStats: JSON.stringify(session.positionStats),
      audioStats: JSON.stringify(session.audioStats),
      combinedAccuracy: session.combinedAccuracy,
      completed: session.completed,
    };
  }

  /**
   * Convert database format to SessionResult
   */
  private fromDBSession(dbSession: DBSession): SessionResult {
    return {
      sessionId: dbSession.sessionId,
      levelId: dbSession.levelId,
      mode: dbSession.mode as TrainingMode,
      nBack: dbSession.nBack as NBackLevel,
      timestamp: dbSession.timestamp,
      duration: dbSession.duration,
      trials: JSON.parse(dbSession.trials) as TrialData[],
      positionStats: JSON.parse(dbSession.positionStats) as PerformanceStats,
      audioStats: JSON.parse(dbSession.audioStats) as PerformanceStats,
      combinedAccuracy: dbSession.combinedAccuracy,
      completed: dbSession.completed,
    };
  }

  /**
   * Save a session result to IndexedDB
   */
  async save(session: SessionResult): Promise<void> {
    await db.sessions.put(this.toDBSession(session));
  }

  /**
   * Find a session by its ID
   */
  async findById(sessionId: string): Promise<SessionResult | null> {
    const dbSession = await db.sessions.get(sessionId);
    return dbSession ? this.fromDBSession(dbSession) : null;
  }

  /**
   * Find all sessions for a specific level
   */
  async findByLevel(levelId: string): Promise<SessionResult[]> {
    const dbSessions = await db.sessions
      .where('levelId')
      .equals(levelId)
      .reverse()
      .toArray();
    return dbSessions.map((s) => this.fromDBSession(s));
  }

  /**
   * Find recent sessions, sorted by date descending
   */
  async findRecent(limit: number): Promise<SessionResult[]> {
    const dbSessions = await db.sessions
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
    return dbSessions.map((s) => this.fromDBSession(s));
  }

  /**
   * Find sessions within a date range
   */
  async findByDateRange(start: Date, end: Date): Promise<SessionResult[]> {
    const dbSessions = await db.sessions
      .where('timestamp')
      .between(start, end, true, true)
      .toArray();
    return dbSessions.map((s) => this.fromDBSession(s));
  }

  /**
   * Get total count of sessions
   */
  async count(): Promise<number> {
    return db.sessions.count();
  }

  /**
   * Delete all sessions
   */
  async clear(): Promise<void> {
    await db.sessions.clear();
  }
}
