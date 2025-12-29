'use client';

/**
 * Supabase Settings Repository
 *
 * Cloud storage adapter for user settings.
 * Works alongside Dexie settings for offline-first sync.
 */

import { getSupabaseBrowserClient, isSupabaseAvailable, type SupabaseBrowserClient } from './client';
import { getDeviceId } from './deviceId';
import type { NeuraliftSettings } from './types';
import type { DBSettings } from '../database';

/**
 * Convert local DB settings to Supabase format
 */
function toSupabaseSettings(settings: DBSettings) {
  return {
    user_id: null as string | null, // TODO: Add when auth is implemented
    device_id: getDeviceId(),
    trial_duration: settings.trialDuration,
    session_length: settings.sessionLength,
    adaptive_mode: settings.adaptiveMode,
    show_history_helper: settings.showHistoryHelper,
    show_briefing: settings.showBriefing,
    sound_enabled: settings.soundEnabled,
    volume: settings.volume,
  };
}

/**
 * Convert Supabase settings to local DB format
 */
function toLocalSettings(settings: NeuraliftSettings): DBSettings {
  return {
    id: 1, // Local DB uses singleton with id=1
    trialDuration: settings.trial_duration,
    sessionLength: settings.session_length,
    adaptiveMode: settings.adaptive_mode,
    showHistoryHelper: settings.show_history_helper,
    showBriefing: settings.show_briefing,
    soundEnabled: settings.sound_enabled,
    volume: settings.volume,
    updated: new Date(settings.updated_at),
  };
}

export class SupabaseSettingsRepository {
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
   * Get settings for current device
   */
  async get(): Promise<DBSettings | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const deviceId = getDeviceId();
      const { data, error } = await client
        .from('neuralift_settings')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (error || !data) return null;

      return toLocalSettings(data);
    } catch (err) {
      console.error('[SupabaseSettingsRepository] Get failed:', err);
      return null;
    }
  }

  /**
   * Save or update settings
   */
  async save(settings: DBSettings): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const deviceId = getDeviceId();
      const supabaseSettings = toSupabaseSettings(settings);

      const { error } = await client
        .from('neuralift_settings')
        .upsert(
          { ...supabaseSettings, device_id: deviceId } as never,
          { onConflict: 'device_id' }
        );

      if (error) {
        console.error('[SupabaseSettingsRepository] Save error:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[SupabaseSettingsRepository] Save failed:', err);
      return false;
    }
  }

  /**
   * Get settings updated after a certain timestamp (for sync)
   */
  async getIfUpdatedAfter(timestamp: Date): Promise<DBSettings | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const deviceId = getDeviceId();
      const { data, error } = await client
        .from('neuralift_settings')
        .select('*')
        .eq('device_id', deviceId)
        .gt('updated_at', timestamp.toISOString())
        .single();

      if (error || !data) return null;

      return toLocalSettings(data);
    } catch (err) {
      console.error('[SupabaseSettingsRepository] GetIfUpdatedAfter failed:', err);
      return null;
    }
  }
}

// Singleton instance
export const supabaseSettingsRepository = new SupabaseSettingsRepository();
