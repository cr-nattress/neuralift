'use client';

/**
 * Database Utility Functions
 *
 * Helper functions for database operations like reset, export, and import.
 */

import { db, type DBSession, type DBProgress, type DBSettings } from './db';

/**
 * Exported data structure
 */
export interface ExportedData {
  sessions: DBSession[];
  progress: DBProgress[];
  settings: DBSettings[];
  exportedAt: string;
  version: string;
}

/**
 * Reset the entire database to default state
 * WARNING: This deletes all user data!
 */
export async function resetDatabase(): Promise<void> {
  await db.delete();
  await db.open();
  await db.initialize();
}

/**
 * Export all user data to a JSON-serializable object
 * Useful for backup or debugging
 */
export async function exportData(): Promise<ExportedData> {
  const [sessions, progress, settings] = await Promise.all([
    db.sessions.toArray(),
    db.progress.toArray(),
    db.settings.toArray(),
  ]);

  return {
    sessions,
    progress,
    settings,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };
}

/**
 * Import data from an exported backup
 * Merges with existing data (doesn't overwrite)
 */
export async function importData(data: ExportedData): Promise<void> {
  // Import sessions (skip duplicates)
  if (data.sessions && data.sessions.length > 0) {
    const existingIds = new Set(
      (await db.sessions.toArray()).map((s) => s.sessionId)
    );

    const newSessions = data.sessions.filter(
      (s) => !existingIds.has(s.sessionId)
    );

    if (newSessions.length > 0) {
      await db.sessions.bulkAdd(newSessions);
    }
  }

  // Update progress (take the one with more sessions)
  if (data.progress && data.progress.length > 0) {
    const importedProgress = data.progress[0];
    const currentProgress = await db.progress.get(1);

    if (
      importedProgress &&
      currentProgress &&
      importedProgress.totalSessions > currentProgress.totalSessions
    ) {
      await db.progress.update(1, {
        ...importedProgress,
        id: 1,
        updated: new Date(),
      });
    }
  }
}

/**
 * Clear all session history while preserving progress and settings
 */
export async function clearSessionHistory(): Promise<void> {
  await db.sessions.clear();
}

/**
 * Clear analytics events older than specified days
 */
export async function clearOldAnalytics(daysToKeep = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const oldEvents = await db.analyticsEvents
    .where('timestamp')
    .below(cutoffDate)
    .toArray();

  const idsToDelete = oldEvents
    .map((e) => e.id)
    .filter((id): id is number => id !== undefined);

  await db.analyticsEvents.bulkDelete(idsToDelete);

  return idsToDelete.length;
}

/**
 * Get database storage usage estimate
 */
export async function getStorageEstimate(): Promise<{
  used: number;
  quota: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage ?? 0;
    const quota = estimate.quota ?? 0;
    const percentage = quota > 0 ? (used / quota) * 100 : 0;

    return { used, quota, percentage };
  }

  // Fallback for browsers without Storage API
  return { used: 0, quota: 0, percentage: 0 };
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}
