'use client';

/**
 * useSettings Hook
 *
 * Provides access to user settings with loading states and persistence.
 */

import { useEffect, useState, useCallback } from 'react';
import { db, type DBSettings } from '@/infrastructure/database';

/**
 * User settings type (without id field)
 */
export interface Settings {
  trialDuration: number;
  sessionLength: number;
  adaptiveMode: boolean;
  showHistoryHelper: boolean;
  showBriefing: boolean;
  soundEnabled: boolean;
  volume: number;
}

/**
 * Hook return type
 */
export interface UseSettingsReturn {
  /** Current settings */
  settings: Settings | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Update a single setting */
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  /** Update multiple settings at once */
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  /** Reset settings to defaults */
  resetSettings: () => Promise<void>;
  /** Refresh settings from database */
  refresh: () => Promise<void>;
}

/**
 * Default settings values
 */
const DEFAULT_SETTINGS: Settings = {
  trialDuration: 3000,
  sessionLength: 20,
  adaptiveMode: false,
  showHistoryHelper: true,
  showBriefing: true,
  soundEnabled: true,
  volume: 80,
};

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load settings from database
   */
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure database is initialized
      await db.initialize();

      const dbSettings = await db.settings.get(1);
      if (dbSettings) {
        const { id, updated, ...settingsData } = dbSettings;
        setSettings(settingsData);
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      const loadError = err instanceof Error ? err : new Error('Failed to load settings');
      setError(loadError);
      console.error('[useSettings] Failed to load:', loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a single setting
   */
  const updateSetting = useCallback(
    async <K extends keyof Settings>(key: K, value: Settings[K]) => {
      if (!settings) return;

      try {
        const updated: DBSettings = {
          id: 1,
          ...settings,
          [key]: value,
          updated: new Date(),
        };

        await db.settings.put(updated);
        setSettings({ ...settings, [key]: value });
      } catch (err) {
        const updateError = err instanceof Error ? err : new Error('Failed to update setting');
        setError(updateError);
        throw updateError;
      }
    },
    [settings]
  );

  /**
   * Update multiple settings at once
   */
  const updateSettings = useCallback(
    async (updates: Partial<Settings>) => {
      if (!settings) return;

      try {
        const newSettings = { ...settings, ...updates };
        const updated: DBSettings = {
          id: 1,
          ...newSettings,
          updated: new Date(),
        };

        await db.settings.put(updated);
        setSettings(newSettings);
      } catch (err) {
        const updateError = err instanceof Error ? err : new Error('Failed to update settings');
        setError(updateError);
        throw updateError;
      }
    },
    [settings]
  );

  /**
   * Reset settings to defaults
   */
  const resetSettings = useCallback(async () => {
    try {
      const updated: DBSettings = {
        id: 1,
        ...DEFAULT_SETTINGS,
        updated: new Date(),
      };

      await db.settings.put(updated);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      const resetError = err instanceof Error ? err : new Error('Failed to reset settings');
      setError(resetError);
      throw resetError;
    }
  }, []);

  /**
   * Refresh settings from database
   */
  const refresh = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  // Load settings on mount
  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    resetSettings,
    refresh,
  };
}
