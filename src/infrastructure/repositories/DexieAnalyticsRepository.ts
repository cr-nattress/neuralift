'use client';

/**
 * DexieAnalyticsRepository
 *
 * Implements IAnalyticsRepository using Dexie.js for IndexedDB storage.
 * Stores analytics events for user profiling and LLM recommendations.
 */

import type {
  IAnalyticsRepository,
  AnalyticsEvent,
  EventCategory,
} from '@neuralift/core';
import { db, type DBAnalyticsEvent } from '../database/db';

export class DexieAnalyticsRepository implements IAnalyticsRepository {
  /**
   * Convert AnalyticsEvent to database format
   */
  private toDBEvent(event: AnalyticsEvent): Omit<DBAnalyticsEvent, 'id'> {
    return {
      type: event.type,
      category: event.category,
      sessionId: event.sessionId ?? null,
      timestamp: event.timestamp,
      payload: JSON.stringify(event.payload),
    };
  }

  /**
   * Convert database format to AnalyticsEvent
   */
  private fromDBEvent(dbEvent: DBAnalyticsEvent): AnalyticsEvent {
    const event: AnalyticsEvent = {
      type: dbEvent.type,
      category: dbEvent.category as EventCategory,
      timestamp: dbEvent.timestamp,
      payload: JSON.parse(dbEvent.payload) as Record<string, unknown>,
    };

    if (dbEvent.sessionId !== null) {
      event.sessionId = dbEvent.sessionId;
    }

    return event;
  }

  /**
   * Track a single analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    await db.analyticsEvents.add(this.toDBEvent(event));
  }

  /**
   * Track multiple events in batch
   */
  async trackEvents(events: AnalyticsEvent[]): Promise<void> {
    const dbEvents = events.map((e) => this.toDBEvent(e));
    await db.analyticsEvents.bulkAdd(dbEvents);
  }

  /**
   * Get events by category
   */
  async getEventsByCategory(category: EventCategory): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('category')
      .equals(category)
      .reverse()
      .toArray();
    return dbEvents.map((e) => this.fromDBEvent(e));
  }

  /**
   * Get events for a specific session
   */
  async getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('sessionId')
      .equals(sessionId)
      .toArray();
    return dbEvents.map((e) => this.fromDBEvent(e));
  }

  /**
   * Get events by type
   */
  async getEventsByType(type: string): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('type')
      .equals(type)
      .reverse()
      .toArray();
    return dbEvents.map((e) => this.fromDBEvent(e));
  }

  /**
   * Get recent events
   */
  async getRecentEvents(limit: number): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
    return dbEvents.map((e) => this.fromDBEvent(e));
  }

  /**
   * Get events since a specific date
   */
  async getEventsSince(since: Date): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('timestamp')
      .above(since)
      .toArray();
    return dbEvents.map((e) => this.fromDBEvent(e));
  }

  /**
   * Get total event count
   */
  async getEventCount(): Promise<number> {
    return db.analyticsEvents.count();
  }

  /**
   * Clear all events
   */
  async clear(): Promise<void> {
    await db.analyticsEvents.clear();
  }

  /**
   * Clear events older than a specific date
   */
  async clearOlderThan(date: Date): Promise<number> {
    const deleted = await db.analyticsEvents
      .where('timestamp')
      .below(date)
      .delete();
    return deleted;
  }
}
