# Story 03-015: Implement Data Sync Service

## Story

**As a** user
**I want** my training data to sync across devices
**So that** I can continue my progress on any device while having offline access

## Points: 8

## Priority: High

## Status: TODO

## Description

Implement a data synchronization service that keeps Dexie (local IndexedDB) and Supabase (cloud PostgreSQL) in sync. Uses offline-first strategy where writes go to Dexie immediately, then sync to Supabase when online.

## Acceptance Criteria

- [ ] All writes persist to Dexie immediately
- [ ] Background sync pushes changes to Supabase when online
- [ ] App loads latest data from Supabase on startup
- [ ] Conflict resolution uses server-wins strategy
- [ ] Sync status indicator shows current state
- [ ] Manual sync trigger available

## Technical Details

### Sync Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Flow                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Action                                                    │
│       │                                                          │
│       ▼                                                          │
│   ┌─────────┐  immediate   ┌─────────────┐                      │
│   │ Service │ ──────────▶  │   Dexie     │                      │
│   │  Layer  │              │ (IndexedDB) │                      │
│   └─────────┘              └──────┬──────┘                      │
│                                   │                              │
│                                   │ background sync              │
│                                   ▼                              │
│                            ┌─────────────┐                      │
│                            │   Supabase  │                      │
│                            │ (PostgreSQL)│                      │
│                            └─────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### DataSyncService Implementation

```typescript
// src/infrastructure/sync/DataSyncService.ts
import type { DexieDatabase } from '../dexie/database';
import { createClient } from '../supabase/client';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export interface SyncResult {
  success: boolean;
  sessionsUploaded: number;
  sessionsDownloaded: number;
  errors: string[];
}

export class DataSyncService {
  private supabase = createClient();
  private db: DexieDatabase;
  private status: SyncStatus = 'idle';
  private listeners = new Set<(status: SyncStatus) => void>();

  constructor(db: DexieDatabase) {
    this.db = db;
    this.setupOnlineListener();
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.sync();
    });
  }

  onStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.listeners.forEach(listener => listener(status));
  }

  getStatus(): SyncStatus {
    return this.status;
  }

  async sync(): Promise<SyncResult> {
    if (!navigator.onLine) {
      this.setStatus('offline');
      return { success: false, sessionsUploaded: 0, sessionsDownloaded: 0, errors: ['Offline'] };
    }

    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) {
      return { success: false, sessionsUploaded: 0, sessionsDownloaded: 0, errors: ['Not authenticated'] };
    }

    this.setStatus('syncing');
    const errors: string[] = [];
    let sessionsUploaded = 0;
    let sessionsDownloaded = 0;

    try {
      // 1. Upload unsynced local sessions
      const unsyncedSessions = await this.db.sessions
        .where('synced')
        .equals(0)
        .toArray();

      for (const session of unsyncedSessions) {
        try {
          await this.uploadSession(session, user.id);
          await this.db.sessions.update(session.id!, { synced: 1 });
          sessionsUploaded++;
        } catch (error) {
          errors.push(`Failed to upload session ${session.id}: ${error}`);
        }
      }

      // 2. Download new sessions from server
      const lastSync = await this.getLastSyncTimestamp();
      const { data: remoteSessions } = await this.supabase
        .from('sessions')
        .select('*')
        .gt('created_at', lastSync.toISOString())
        .order('created_at', { ascending: true });

      if (remoteSessions) {
        for (const remoteSession of remoteSessions) {
          const localExists = await this.db.sessions.get(remoteSession.id);
          if (!localExists) {
            await this.db.sessions.add(this.fromSupabaseSession(remoteSession));
            sessionsDownloaded++;
          }
        }
      }

      // 3. Sync progress data
      await this.syncProgress(user.id);

      // 4. Sync settings
      await this.syncSettings(user.id);

      // 5. Update last sync timestamp
      await this.setLastSyncTimestamp(new Date());

      this.setStatus('idle');
      return { success: true, sessionsUploaded, sessionsDownloaded, errors };

    } catch (error) {
      this.setStatus('error');
      errors.push(`Sync failed: ${error}`);
      return { success: false, sessionsUploaded, sessionsDownloaded, errors };
    }
  }

  private async uploadSession(session: any, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('sessions')
      .upsert({
        id: session.id,
        user_id: userId,
        level_id: session.levelId,
        mode: session.mode,
        n_back: session.nBack,
        timestamp: session.timestamp.toISOString(),
        duration: session.duration,
        trials: session.trials,
        position_stats: session.positionStats,
        audio_stats: session.audioStats,
        combined_accuracy: session.combinedAccuracy,
        completed: session.completed,
      });

    if (error) throw error;
  }

  private async syncProgress(userId: string): Promise<void> {
    // Get local progress
    const localProgress = await this.db.progress.get('current');

    // Get remote progress
    const { data: remoteProfile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!remoteProfile && localProgress) {
      // Upload local to remote
      await this.supabase
        .from('profiles')
        .upsert({
          id: userId,
          current_level: localProgress.currentLevel,
          total_sessions: localProgress.totalSessions,
          total_time: localProgress.totalTime,
          current_streak: localProgress.currentStreak,
          longest_streak: localProgress.longestStreak,
          last_session_date: localProgress.lastSessionDate?.toISOString().split('T')[0],
        });
    } else if (remoteProfile) {
      // Server wins - update local with remote
      const remoteUpdated = new Date(remoteProfile.updated_at);
      const localUpdated = localProgress?.updatedAt || new Date(0);

      if (remoteUpdated > localUpdated) {
        await this.db.progress.put({
          id: 'current',
          currentLevel: remoteProfile.current_level,
          totalSessions: remoteProfile.total_sessions,
          totalTime: remoteProfile.total_time,
          currentStreak: remoteProfile.current_streak,
          longestStreak: remoteProfile.longest_streak,
          lastSessionDate: remoteProfile.last_session_date
            ? new Date(remoteProfile.last_session_date)
            : null,
          updatedAt: remoteUpdated,
        });
      }
    }
  }

  private async syncSettings(userId: string): Promise<void> {
    const localSettings = await this.db.settings.get('current');

    const { data: remoteSettings } = await this.supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!remoteSettings && localSettings) {
      await this.supabase
        .from('settings')
        .upsert({
          user_id: userId,
          ...localSettings,
        });
    } else if (remoteSettings) {
      const remoteUpdated = new Date(remoteSettings.updated_at);
      const localUpdated = localSettings?.updatedAt || new Date(0);

      if (remoteUpdated > localUpdated) {
        await this.db.settings.put({
          id: 'current',
          trialDuration: remoteSettings.trial_duration,
          sessionLength: remoteSettings.session_length,
          adaptiveMode: remoteSettings.adaptive_mode,
          showHistoryHelper: remoteSettings.show_history_helper,
          showBriefing: remoteSettings.show_briefing,
          soundEnabled: remoteSettings.sound_enabled,
          volume: remoteSettings.volume,
          updatedAt: remoteUpdated,
        });
      }
    }
  }

  private async getLastSyncTimestamp(): Promise<Date> {
    const meta = await this.db.meta.get('lastSync');
    return meta ? new Date(meta.value) : new Date(0);
  }

  private async setLastSyncTimestamp(date: Date): Promise<void> {
    await this.db.meta.put({ key: 'lastSync', value: date.toISOString() });
  }

  private fromSupabaseSession(row: any): any {
    return {
      id: row.id,
      levelId: row.level_id,
      mode: row.mode,
      nBack: row.n_back,
      timestamp: new Date(row.timestamp),
      duration: row.duration,
      trials: row.trials,
      positionStats: row.position_stats,
      audioStats: row.audio_stats,
      combinedAccuracy: Number(row.combined_accuracy),
      completed: row.completed,
      synced: 1,
    };
  }
}
```

### Dexie Schema Update

```typescript
// Update src/infrastructure/dexie/database.ts
import Dexie, { Table } from 'dexie';

export interface DexieSession {
  id?: string;
  levelId: string;
  mode: string;
  nBack: number;
  timestamp: Date;
  duration: number;
  trials: any[];
  positionStats: any;
  audioStats: any;
  combinedAccuracy: number;
  completed: boolean;
  synced: number; // 0 = unsynced, 1 = synced
}

export interface DexieMeta {
  key: string;
  value: string;
}

export class DexieDatabase extends Dexie {
  sessions!: Table<DexieSession>;
  progress!: Table<any>;
  settings!: Table<any>;
  analytics!: Table<any>;
  meta!: Table<DexieMeta>;

  constructor() {
    super('neuralift');
    this.version(2).stores({
      sessions: '++id, levelId, timestamp, synced',
      progress: 'id',
      settings: 'id',
      analytics: '++id, type, timestamp, synced',
      meta: 'key',
    });
  }
}
```

### Sync Hook

```typescript
// src/hooks/useDataSync.ts
import { useState, useEffect, useCallback } from 'react';
import { DataSyncService, SyncStatus, SyncResult } from '@/infrastructure/sync/DataSyncService';

export function useDataSync(syncService: DataSyncService) {
  const [status, setStatus] = useState<SyncStatus>(syncService.getStatus());
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    return syncService.onStatusChange(setStatus);
  }, [syncService]);

  const sync = useCallback(async () => {
    const result = await syncService.sync();
    setLastResult(result);
    return result;
  }, [syncService]);

  return {
    status,
    lastResult,
    sync,
    isOnline: navigator.onLine,
  };
}
```

### Sync Status Component

```typescript
// src/components/SyncStatus.tsx
import { useDataSync } from '@/hooks/useDataSync';

export function SyncStatus() {
  const { status, sync } = useDataSync();

  const statusConfig = {
    idle: { icon: '✓', text: 'Synced', color: 'text-green-500' },
    syncing: { icon: '↻', text: 'Syncing...', color: 'text-blue-500' },
    error: { icon: '!', text: 'Sync error', color: 'text-red-500' },
    offline: { icon: '○', text: 'Offline', color: 'text-gray-500' },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={sync}
      className={`flex items-center gap-2 ${config.color}`}
      title="Click to sync"
    >
      <span className={status === 'syncing' ? 'animate-spin' : ''}>
        {config.icon}
      </span>
      <span className="text-sm">{config.text}</span>
    </button>
  );
}
```

## Tasks

- [ ] Update Dexie schema with synced flag and meta table
- [ ] Create DataSyncService class
- [ ] Implement session upload/download logic
- [ ] Implement progress sync with conflict resolution
- [ ] Implement settings sync
- [ ] Create useDataSync hook
- [ ] Create SyncStatus component
- [ ] Add sync on app startup
- [ ] Add sync on online event
- [ ] Test offline-first behavior
- [ ] Test conflict resolution

## Dependencies

- Story 03-003 (Dexie Database)
- Story 03-013 (Supabase Repositories)
- Story 01-009 (Supabase Setup)

## Notes

- Offline-first: writes always succeed locally
- Background sync is non-blocking
- Server wins on conflicts (uses updated_at timestamp)
- Consider using Supabase Realtime for live sync in future
- Service worker can trigger sync on reconnection
