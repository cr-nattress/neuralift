'use client';

/**
 * Supabase Progress Repository
 *
 * Cloud storage adapter for user progress data.
 * Works alongside DexieProgressRepository for offline-first sync.
 */

import { getSupabaseBrowserClient, isSupabaseAvailable, type SupabaseBrowserClient } from './client';
import { getDeviceId } from './deviceId';
import type { NeuraliftProgress } from './types';
import type { DBProgress } from '../database';

/**
 * Convert local DB progress to Supabase format
 */
function toSupabaseProgress(progress: DBProgress) {
  return {
    user_id: null as string | null, // TODO: Add when auth is implemented
    device_id: getDeviceId(),
    current_level: progress.currentLevel,
    unlocked_levels: JSON.parse(progress.unlockedLevels) as string[],
    total_sessions: progress.totalSessions,
    total_time: progress.totalTime,
    current_streak: progress.currentStreak,
    longest_streak: progress.longestStreak,
    last_session_date: progress.lastSessionDate,
  };
}

/**
 * Convert Supabase progress to local DB format
 */
function toLocalProgress(progress: NeuraliftProgress): DBProgress {
  return {
    id: 1, // Local DB uses singleton with id=1
    currentLevel: progress.current_level,
    unlockedLevels: JSON.stringify(progress.unlocked_levels),
    totalSessions: progress.total_sessions,
    totalTime: progress.total_time,
    currentStreak: progress.current_streak,
    longestStreak: progress.longest_streak,
    lastSessionDate: progress.last_session_date,
    updated: new Date(progress.updated_at),
  };
}

export class SupabaseProgressRepository {
  private getClient(): SupabaseBrowserClient | null {
    return getSupabaseBrowserClient();
  }

  /**
   * Check if Supabase is available for sync
   */
  isAvailable(): boolean {
    return isSupabaseAvailable();
  }

  /**
   * Get progress for current device
   */
  async get(): Promise<DBProgress | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const deviceId = getDeviceId();
      const { data, error } = await client
        .from('neuralift_progress')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (error || !data) return null;

      return toLocalProgress(data);
    } catch (err) {
      console.error('[SupabaseProgressRepository] Get failed:', err);
      return null;
    }
  }

  /**
   * Save or update progress
   */
  async save(progress: DBProgress): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const deviceId = getDeviceId();
      const supabaseProgress = toSupabaseProgress(progress);

      const { error } = await client
        .from('neuralift_progress')
        .upsert(
          { ...supabaseProgress, device_id: deviceId } as never,
          { onConflict: 'device_id' }
        );

      if (error) {
        console.error('[SupabaseProgressRepository] Save error:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[SupabaseProgressRepository] Save failed:', err);
      return false;
    }
  }

  /**
   * Get progress updated after a certain timestamp (for sync)
   */
  async getIfUpdatedAfter(timestamp: Date): Promise<DBProgress | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const deviceId = getDeviceId();
      const { data, error } = await client
        .from('neuralift_progress')
        .select('*')
        .eq('device_id', deviceId)
        .gt('updated_at', timestamp.toISOString())
        .single();

      if (error || !data) return null;

      return toLocalProgress(data);
    } catch (err) {
      console.error('[SupabaseProgressRepository] GetIfUpdatedAfter failed:', err);
      return null;
    }
  }
}

// Singleton instance
export const supabaseProgressRepository = new SupabaseProgressRepository();
