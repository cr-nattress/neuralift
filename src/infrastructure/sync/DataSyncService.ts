'use client';

/**
 * Data Sync Service
 *
 * Handles offline-first synchronization between local Dexie database
 * and Supabase cloud storage.
 *
 * Strategy:
 * 1. All writes go to Dexie first (instant, works offline)
 * 2. Background sync pushes to Supabase when online
 * 3. On app load, pull latest from Supabase
 * 4. Conflict resolution: server wins (latest timestamp)
 */

import { db, type DBSession, type DBProgress, type DBSettings } from '../database';
import { isSupabaseAvailable } from '../supabase/client';
import { supabaseSessionRepository } from '../supabase/SupabaseSessionRepository';
import { supabaseProgressRepository } from '../supabase/SupabaseProgressRepository';
import { supabaseSettingsRepository } from '../supabase/SupabaseSettingsRepository';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSyncAt: Date | null;
  error: string | null;
  pendingChanges: number;
}

type SyncListener = (state: SyncState) => void;

const SYNC_INTERVAL = 60000; // 1 minute
const SYNC_STORAGE_KEY = 'neuralift_last_sync';

class DataSyncService {
  private state: SyncState = {
    status: 'idle',
    lastSyncAt: null,
    error: null,
    pendingChanges: 0,
  };

  private listeners: Set<SyncListener> = new Set();
  private syncIntervalId: ReturnType<typeof setInterval> | null = null;
  private isSyncing = false;

  /**
   * Initialize the sync service
   * Call this on app startup
   */
  async initialize(): Promise<void> {
    // Load last sync timestamp
    this.loadLastSyncTime();

    // Check if we're online and Supabase is available
    if (!navigator.onLine || !isSupabaseAvailable()) {
      this.updateState({ status: 'offline' });
      return;
    }

    // Initial sync
    await this.sync();

    // Set up periodic sync
    this.startPeriodicSync();

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  /**
   * Clean up the sync service
   */
  destroy(): void {
    this.stopPeriodicSync();
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  /**
   * Subscribe to sync state changes
   */
  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return { ...this.state };
  }

  /**
   * Trigger a manual sync
   */
  async sync(): Promise<boolean> {
    if (this.isSyncing) return false;
    if (!navigator.onLine || !isSupabaseAvailable()) {
      this.updateState({ status: 'offline' });
      return false;
    }

    this.isSyncing = true;
    this.updateState({ status: 'syncing', error: null });

    try {
      // Sync in parallel
      const results = await Promise.allSettled([
        this.syncSessions(),
        this.syncProgress(),
        this.syncSettings(),
      ]);

      // Check for any failures
      const failures = results.filter((r) => r.status === 'rejected');
      if (failures.length > 0) {
        const errors = failures.map((f) => (f as PromiseRejectedResult).reason);
        console.error('[DataSyncService] Some syncs failed:', errors);
        this.updateState({
          status: 'error',
          error: `${failures.length} sync(s) failed`,
        });
        return false;
      }

      // All succeeded
      const now = new Date();
      this.saveLastSyncTime(now);
      this.updateState({
        status: 'success',
        lastSyncAt: now,
        pendingChanges: 0,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      console.error('[DataSyncService] Sync error:', err);
      this.updateState({ status: 'error', error: errorMessage });
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Mark that there are pending changes to sync
   */
  markPendingChanges(): void {
    this.updateState({ pendingChanges: this.state.pendingChanges + 1 });
  }

  // =========================================================================
  // Private Methods
  // =========================================================================

  private async syncSessions(): Promise<void> {
    const lastSync = this.state.lastSyncAt ?? new Date(0);

    // Push local sessions to cloud
    const localSessions = await db.sessions
      .filter((s) => new Date(s.timestamp) > lastSync)
      .toArray();

    if (localSessions.length > 0) {
      const success = await supabaseSessionRepository.batchUpsert(localSessions);
      if (!success) {
        throw new Error('Failed to push sessions');
      }
    }

    // Pull cloud sessions to local
    const cloudSessions = await supabaseSessionRepository.getUpdatedAfter(lastSync);
    for (const session of cloudSessions) {
      const existing = await db.sessions.get(session.sessionId);
      if (!existing || new Date(session.timestamp) > existing.timestamp) {
        await db.sessions.put(session);
      }
    }
  }

  private async syncProgress(): Promise<void> {
    const localProgress = await db.progress.get(1);
    if (!localProgress) return;

    // Try to get cloud progress
    const cloudProgress = await supabaseProgressRepository.get();

    if (!cloudProgress) {
      // No cloud data, push local
      await supabaseProgressRepository.save(localProgress);
    } else {
      // Compare timestamps, server wins if newer
      const localUpdated = localProgress.updated ?? new Date(0);
      const cloudUpdated = new Date(cloudProgress.updated ?? 0);

      if (cloudUpdated > localUpdated) {
        // Cloud is newer, update local
        await db.progress.put({ ...cloudProgress, id: 1 });
      } else if (localUpdated > cloudUpdated) {
        // Local is newer, push to cloud
        await supabaseProgressRepository.save(localProgress);
      }
    }
  }

  private async syncSettings(): Promise<void> {
    const localSettings = await db.settings.get(1);
    if (!localSettings) return;

    // Try to get cloud settings
    const cloudSettings = await supabaseSettingsRepository.get();

    if (!cloudSettings) {
      // No cloud data, push local
      await supabaseSettingsRepository.save(localSettings);
    } else {
      // Compare timestamps, server wins if newer
      const localUpdated = localSettings.updated ?? new Date(0);
      const cloudUpdated = new Date(cloudSettings.updated ?? 0);

      if (cloudUpdated > localUpdated) {
        // Cloud is newer, update local
        await db.settings.put({ ...cloudSettings, id: 1 });
      } else if (localUpdated > cloudUpdated) {
        // Local is newer, push to cloud
        await supabaseSettingsRepository.save(localSettings);
      }
    }
  }

  private updateState(partial: Partial<SyncState>): void {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private startPeriodicSync(): void {
    if (this.syncIntervalId) return;
    this.syncIntervalId = setInterval(() => {
      if (this.state.pendingChanges > 0) {
        void this.sync();
      }
    }, SYNC_INTERVAL);
  }

  private stopPeriodicSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  private handleOnline = (): void => {
    if (isSupabaseAvailable()) {
      this.updateState({ status: 'idle' });
      void this.sync();
    }
  };

  private handleOffline = (): void => {
    this.updateState({ status: 'offline' });
  };

  private loadLastSyncTime(): void {
    try {
      const stored = localStorage.getItem(SYNC_STORAGE_KEY);
      if (stored) {
        this.state.lastSyncAt = new Date(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private saveLastSyncTime(date: Date): void {
    try {
      localStorage.setItem(SYNC_STORAGE_KEY, date.toISOString());
    } catch {
      // Ignore localStorage errors
    }
  }
}

// Singleton instance
export const dataSyncService = new DataSyncService();
