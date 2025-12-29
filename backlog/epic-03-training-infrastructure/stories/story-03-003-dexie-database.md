# Story 03-003: Setup Dexie Database

## Story

**As a** developer
**I want** a Dexie database schema defined
**So that** data persists in IndexedDB reliably

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Setup Dexie.js with the complete database schema for sessions, progress, analytics events, and settings.

## Acceptance Criteria

- [ ] Database schema defined with all tables
- [ ] Indexes for common queries
- [ ] Migrations support for future changes
- [ ] TypeScript types for all tables
- [ ] Database singleton exported

## Technical Details

### Database Definition

```typescript
// src/infrastructure/database/db.ts
import Dexie, { type Table } from 'dexie';

export interface DBSession {
  sessionId: string;
  levelId: string;
  mode: string;
  nBack: number;
  timestamp: Date;
  duration: number;
  trials: string; // JSON stringified TrialData[]
  positionStats: string; // JSON stringified PerformanceStats
  audioStats: string;
  combinedAccuracy: number;
  completed: boolean;
}

export interface DBProgress {
  id: number; // Always 1 - singleton record
  currentLevel: string;
  unlockedLevels: string; // JSON stringified string[]
  totalSessions: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  updated: Date;
}

export interface DBAnalyticsEvent {
  id?: number;
  type: string;
  category: string;
  sessionId: string | null;
  timestamp: Date;
  payload: string; // JSON stringified
}

export interface DBSettings {
  id: number; // Always 1 - singleton record
  trialDuration: number;
  sessionLength: number;
  adaptiveMode: boolean;
  showHistoryHelper: boolean;
  showBriefing: boolean;
  soundEnabled: boolean;
  volume: number;
  updated: Date;
}

export class NeuraliftDB extends Dexie {
  sessions!: Table<DBSession>;
  progress!: Table<DBProgress>;
  analyticsEvents!: Table<DBAnalyticsEvent>;
  settings!: Table<DBSettings>;

  constructor() {
    super('neuralift');

    this.version(1).stores({
      sessions: 'sessionId, levelId, timestamp, completed',
      progress: 'id',
      analyticsEvents: '++id, type, category, sessionId, timestamp',
      settings: 'id',
    });
  }

  // Initialize default records
  async initialize(): Promise<void> {
    const progressCount = await this.progress.count();
    if (progressCount === 0) {
      await this.progress.add({
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

    const settingsCount = await this.settings.count();
    if (settingsCount === 0) {
      await this.settings.add({
        id: 1,
        trialDuration: 3000,
        sessionLength: 20,
        adaptiveMode: false,
        showHistoryHelper: true,
        showBriefing: true,
        soundEnabled: true,
        volume: 80,
        updated: new Date(),
      });
    }
  }
}

// Singleton instance
export const db = new NeuraliftDB();
```

### Utility Functions

```typescript
// src/infrastructure/database/utils.ts
import { db } from './db';

export async function resetDatabase(): Promise<void> {
  await db.delete();
  await db.open();
  await db.initialize();
}

export async function exportData(): Promise<object> {
  return {
    sessions: await db.sessions.toArray(),
    progress: await db.progress.toArray(),
    settings: await db.settings.toArray(),
    exportedAt: new Date().toISOString(),
  };
}
```

## Tasks

- [ ] Create src/infrastructure/database/ directory
- [ ] Create db.ts with Dexie class
- [ ] Define all table interfaces
- [ ] Add indexes for efficient queries
- [ ] Add initialization method for defaults
- [ ] Create utils.ts with helper functions
- [ ] Test database creation in browser
- [ ] Verify data persists across refreshes

## Dependencies

- Story 01-001 (Initialize Project - Dexie installed)

## Notes

- JSON stringification used for complex nested objects
- Singleton pattern for singleton records (progress, settings)
- IndexedDB is offline-first and persistent
