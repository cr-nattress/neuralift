# Story 03-008: Implement Analytics Repository

## Story

**As a** developer
**I want** an analytics repository
**So that** user interaction events are stored for analysis

## Points: 5

## Priority: High

## Status: TODO

## Description

Implement the IAnalyticsRepository port interface using Dexie for storing analytics events that power user profiling and LLM recommendations.

## Acceptance Criteria

- [ ] Implements IAnalyticsRepository interface
- [ ] Stores events with full metadata
- [ ] Query events by category, session, time
- [ ] Efficient bulk insertion
- [ ] Data retention/cleanup support

## Technical Details

### DexieAnalyticsRepository

```typescript
// src/infrastructure/repositories/DexieAnalyticsRepository.ts
import type { IAnalyticsRepository, AnalyticsEvent } from '@neuralift/core';
import { db, type DBAnalyticsEvent } from '../database/db';

export class DexieAnalyticsRepository implements IAnalyticsRepository {
  private toDBEvent(event: AnalyticsEvent): Omit<DBAnalyticsEvent, 'id'> {
    return {
      type: event.type,
      category: event.category,
      sessionId: event.sessionId ?? null,
      timestamp: event.timestamp,
      payload: JSON.stringify(event.payload),
    };
  }

  private fromDBEvent(dbEvent: DBAnalyticsEvent): AnalyticsEvent {
    return {
      type: dbEvent.type,
      category: dbEvent.category,
      sessionId: dbEvent.sessionId ?? undefined,
      timestamp: dbEvent.timestamp,
      payload: JSON.parse(dbEvent.payload),
    };
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    await db.analyticsEvents.add(this.toDBEvent(event));
  }

  async trackEvents(events: AnalyticsEvent[]): Promise<void> {
    await db.analyticsEvents.bulkAdd(events.map(this.toDBEvent));
  }

  async getEventsByCategory(category: string): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('category')
      .equals(category)
      .toArray();
    return dbEvents.map(this.fromDBEvent);
  }

  async getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('sessionId')
      .equals(sessionId)
      .toArray();
    return dbEvents.map(this.fromDBEvent);
  }

  async getRecentEvents(limit: number): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
    return dbEvents.map(this.fromDBEvent);
  }

  async getEventsSince(since: Date): Promise<AnalyticsEvent[]> {
    const dbEvents = await db.analyticsEvents
      .where('timestamp')
      .above(since)
      .toArray();
    return dbEvents.map(this.fromDBEvent);
  }

  async getEventCount(): Promise<number> {
    return db.analyticsEvents.count();
  }

  async clear(): Promise<void> {
    await db.analyticsEvents.clear();
  }

  async clearOlderThan(date: Date): Promise<number> {
    const deleted = await db.analyticsEvents
      .where('timestamp')
      .below(date)
      .delete();
    return deleted;
  }
}
```

### AnalyticsEvent Type

```typescript
// In core domain
export interface AnalyticsEvent {
  type: string;
  category: EventCategory;
  sessionId?: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export type EventCategory =
  | 'session'
  | 'trial'
  | 'navigation'
  | 'interaction'
  | 'settings'
  | 'help'
  | 'performance'
  | 'engagement';
```

## Tasks

- [ ] Create src/infrastructure/repositories/DexieAnalyticsRepository.ts
- [ ] Implement all IAnalyticsRepository methods
- [ ] Add bulk insertion for performance
- [ ] Add cleanup method for data retention
- [ ] Test query methods
- [ ] Export from infrastructure index

## Dependencies

- Story 01-005 (Port Interfaces)
- Story 03-003 (Dexie Database)

## Notes

- IndexedDB can handle large event volumes
- Bulk insertion improves performance
- Consider implementing data retention policy
