'use client';

/**
 * Supabase Session Repository
 *
 * Cloud storage adapter for training sessions.
 * Works alongside DexieSessionRepository for offline-first sync.
 */

import { getSupabaseBrowserClient, isSupabaseAvailable, type SupabaseBrowserClient } from './client';
import type { NeuraliftSession } from './types';
import type { DBSession } from '../database';

/**
 * Convert local DB session to Supabase format
 */
function toSupabaseSession(session: DBSession) {
  return {
    session_id: session.sessionId,
    user_id: null as string | null, // TODO: Add when auth is implemented
    level_id: session.levelId,
    mode: session.mode,
    n_back: session.nBack,
    timestamp: session.timestamp.toISOString(),
    duration: session.duration,
    trials: JSON.parse(session.trials),
    position_stats: JSON.parse(session.positionStats),
    audio_stats: JSON.parse(session.audioStats),
    combined_accuracy: session.combinedAccuracy,
    completed: session.completed,
  };
}

/**
 * Convert Supabase session to local DB format
 */
function toLocalSession(session: NeuraliftSession): DBSession {
  return {
    sessionId: session.session_id,
    levelId: session.level_id,
    mode: session.mode,
    nBack: session.n_back,
    timestamp: new Date(session.timestamp),
    duration: session.duration,
    trials: JSON.stringify(session.trials),
    positionStats: JSON.stringify(session.position_stats),
    audioStats: JSON.stringify(session.audio_stats),
    combinedAccuracy: session.combined_accuracy,
    completed: session.completed,
  };
}

export class SupabaseSessionRepository {
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
   * Save a session to Supabase
   */
  async save(session: DBSession): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const supabaseSession = toSupabaseSession(session);
      const { error } = await client
        .from('neuralift_sessions')
        .upsert(supabaseSession as never, { onConflict: 'session_id' });

      if (error) {
        console.error('[SupabaseSessionRepository] Save error:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[SupabaseSessionRepository] Save failed:', err);
      return false;
    }
  }

  /**
   * Get a session by ID
   */
  async getById(sessionId: string): Promise<DBSession | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('neuralift_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error || !data) return null;

      return toLocalSession(data);
    } catch (err) {
      console.error('[SupabaseSessionRepository] GetById failed:', err);
      return null;
    }
  }

  /**
   * Get recent sessions
   */
  async getRecent(limit = 10): Promise<DBSession[]> {
    const client = this.getClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('neuralift_sessions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error || !data) return [];

      return data.map(toLocalSession);
    } catch (err) {
      console.error('[SupabaseSessionRepository] GetRecent failed:', err);
      return [];
    }
  }

  /**
   * Get sessions updated after a certain timestamp (for sync)
   */
  async getUpdatedAfter(timestamp: Date): Promise<DBSession[]> {
    const client = this.getClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('neuralift_sessions')
        .select('*')
        .gt('updated_at', timestamp.toISOString())
        .order('updated_at', { ascending: true });

      if (error || !data) return [];

      return data.map(toLocalSession);
    } catch (err) {
      console.error('[SupabaseSessionRepository] GetUpdatedAfter failed:', err);
      return [];
    }
  }

  /**
   * Batch upsert sessions (for sync)
   */
  async batchUpsert(sessions: DBSession[]): Promise<boolean> {
    const client = this.getClient();
    if (!client || sessions.length === 0) return false;

    try {
      const supabaseSessions = sessions.map(toSupabaseSession);
      const { error } = await client
        .from('neuralift_sessions')
        .upsert(supabaseSessions as never[], { onConflict: 'session_id' });

      if (error) {
        console.error('[SupabaseSessionRepository] BatchUpsert error:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[SupabaseSessionRepository] BatchUpsert failed:', err);
      return false;
    }
  }
}

// Singleton instance
export const supabaseSessionRepository = new SupabaseSessionRepository();
