# Story 03-005: Implement Progress Repository

## Story

**As a** developer
**I want** a ProgressRepository adapter
**So that** user progress persists between sessions

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Implement the IProgressRepository port interface using Dexie for storing user progress including unlocked levels, streaks, and statistics.

## Acceptance Criteria

- [ ] Implements IProgressRepository interface
- [ ] Stores and retrieves user progress
- [ ] Handles streak calculation
- [ ] Manages unlocked levels list
- [ ] Reset functionality works

## Technical Details

### DexieProgressRepository

```typescript
// src/infrastructure/repositories/DexieProgressRepository.ts
import type { IProgressRepository, UserProgress } from '@neuralift/core';
import { db } from '../database/db';

export class DexieProgressRepository implements IProgressRepository {
  async get(): Promise<UserProgress> {
    await db.initialize(); // Ensure defaults exist

    const dbProgress = await db.progress.get(1);
    if (!dbProgress) {
      throw new Error('Progress record not found');
    }

    return {
      currentLevel: dbProgress.currentLevel,
      unlockedLevels: JSON.parse(dbProgress.unlockedLevels),
      totalSessions: dbProgress.totalSessions,
      totalTime: dbProgress.totalTime,
      currentStreak: dbProgress.currentStreak,
      longestStreak: dbProgress.longestStreak,
      lastSessionDate: dbProgress.lastSessionDate
        ? new Date(dbProgress.lastSessionDate)
        : null,
    };
  }

  async save(progress: UserProgress): Promise<void> {
    await db.progress.put({
      id: 1,
      currentLevel: progress.currentLevel,
      unlockedLevels: JSON.stringify(progress.unlockedLevels),
      totalSessions: progress.totalSessions,
      totalTime: progress.totalTime,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lastSessionDate: progress.lastSessionDate?.toISOString() ?? null,
      updated: new Date(),
    });
  }

  async reset(): Promise<void> {
    await db.progress.put({
      id: 1,
      currentLevel: 'position-1back',
      unlockedLevels: JSON.stringify(['position-1back', 'audio-1back']),
      totalSessions: 0,
      totalTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      updated: new Date(),
    });
  }
}
```

### UserProgress Type

```typescript
// In core domain
export interface UserProgress {
  currentLevel: string;
  unlockedLevels: string[];
  totalSessions: number;
  totalTime: number; // in milliseconds
  currentStreak: number; // days
  longestStreak: number;
  lastSessionDate: Date | null;
}
```

## Tasks

- [ ] Create src/infrastructure/repositories/DexieProgressRepository.ts
- [ ] Implement get(), save(), and reset() methods
- [ ] Handle initial defaults via db.initialize()
- [ ] Test streak persistence
- [ ] Test unlocked levels array serialization
- [ ] Export from infrastructure index

## Dependencies

- Story 01-005 (Port Interfaces)
- Story 03-003 (Dexie Database)

## Notes

- Singleton record with id=1
- Arrays stored as JSON strings
- Dates stored as ISO strings
