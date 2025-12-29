# Story 03-004: Implement Session Repository

## Story

**As a** developer
**I want** a SessionRepository adapter
**So that** session data persists to IndexedDB

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Implement the ISessionRepository port interface using Dexie for IndexedDB storage.

## Acceptance Criteria

- [ ] Implements ISessionRepository interface
- [ ] Saves session results to IndexedDB
- [ ] Queries by ID, level, and date range
- [ ] Returns recent sessions sorted by date
- [ ] Handles JSON serialization/deserialization

## Technical Details

### DexieSessionRepository

```typescript
// src/infrastructure/repositories/DexieSessionRepository.ts
import type { ISessionRepository, SessionResult, TrialData, PerformanceStats } from '@neuralift/core';
import { db, type DBSession } from '../database/db';

export class DexieSessionRepository implements ISessionRepository {
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

  private fromDBSession(dbSession: DBSession): SessionResult {
    return {
      sessionId: dbSession.sessionId,
      levelId: dbSession.levelId,
      mode: dbSession.mode as any,
      nBack: dbSession.nBack as any,
      timestamp: dbSession.timestamp,
      duration: dbSession.duration,
      trials: JSON.parse(dbSession.trials) as TrialData[],
      positionStats: JSON.parse(dbSession.positionStats) as PerformanceStats,
      audioStats: JSON.parse(dbSession.audioStats) as PerformanceStats,
      combinedAccuracy: dbSession.combinedAccuracy,
      completed: dbSession.completed,
    };
  }

  async save(session: SessionResult): Promise<void> {
    await db.sessions.put(this.toDBSession(session));
  }

  async findById(sessionId: string): Promise<SessionResult | null> {
    const dbSession = await db.sessions.get(sessionId);
    return dbSession ? this.fromDBSession(dbSession) : null;
  }

  async findByLevel(levelId: string): Promise<SessionResult[]> {
    const dbSessions = await db.sessions
      .where('levelId')
      .equals(levelId)
      .toArray();
    return dbSessions.map(this.fromDBSession);
  }

  async findRecent(limit: number): Promise<SessionResult[]> {
    const dbSessions = await db.sessions
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
    return dbSessions.map(this.fromDBSession);
  }

  async findByDateRange(start: Date, end: Date): Promise<SessionResult[]> {
    const dbSessions = await db.sessions
      .where('timestamp')
      .between(start, end)
      .toArray();
    return dbSessions.map(this.fromDBSession);
  }

  async count(): Promise<number> {
    return db.sessions.count();
  }

  async clear(): Promise<void> {
    await db.sessions.clear();
  }
}
```

## Tasks

- [ ] Create src/infrastructure/repositories/DexieSessionRepository.ts
- [ ] Implement all ISessionRepository methods
- [ ] Add serialization/deserialization helpers
- [ ] Test CRUD operations
- [ ] Test date range queries
- [ ] Export from infrastructure index

## Dependencies

- Story 01-005 (Port Interfaces)
- Story 03-003 (Dexie Database)

## Notes

- JSON serialization handles nested objects
- Dexie handles IndexedDB transactions automatically
