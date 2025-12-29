'use client';

/**
 * DexieProgressRepository
 *
 * Implements IProgressRepository using Dexie.js for IndexedDB storage.
 */

import type { IProgressRepository, UserProgress } from '@neuralift/core';
import { db } from '../database/db';

/**
 * Default progress values for new users
 */
const DEFAULT_PROGRESS: UserProgress = {
  currentLevel: 'position-1back',
  unlockedLevels: ['position-1back', 'audio-1back'],
  totalSessions: 0,
  totalTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
};

/**
 * Check if two dates are on the same calendar day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if date1 is exactly one day before date2
 */
function isConsecutiveDay(earlier: Date, later: Date): boolean {
  const nextDay = new Date(earlier);
  nextDay.setDate(nextDay.getDate() + 1);
  return isSameDay(nextDay, later);
}

export class DexieProgressRepository implements IProgressRepository {
  /**
   * Get the user's current progress
   */
  async get(): Promise<UserProgress> {
    await db.initialize();

    const dbProgress = await db.progress.get(1);
    if (!dbProgress) {
      return { ...DEFAULT_PROGRESS };
    }

    return {
      currentLevel: dbProgress.currentLevel,
      unlockedLevels: JSON.parse(dbProgress.unlockedLevels) as string[],
      totalSessions: dbProgress.totalSessions,
      totalTime: dbProgress.totalTime,
      currentStreak: dbProgress.currentStreak,
      longestStreak: dbProgress.longestStreak,
      lastSessionDate: dbProgress.lastSessionDate
        ? new Date(dbProgress.lastSessionDate)
        : null,
    };
  }

  /**
   * Save the user's progress
   */
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

  /**
   * Reset progress to defaults
   */
  async reset(): Promise<void> {
    await db.progress.put({
      id: 1,
      currentLevel: DEFAULT_PROGRESS.currentLevel,
      unlockedLevels: JSON.stringify(DEFAULT_PROGRESS.unlockedLevels),
      totalSessions: DEFAULT_PROGRESS.totalSessions,
      totalTime: DEFAULT_PROGRESS.totalTime,
      currentStreak: DEFAULT_PROGRESS.currentStreak,
      longestStreak: DEFAULT_PROGRESS.longestStreak,
      lastSessionDate: null,
      updated: new Date(),
    });
  }

  /**
   * Update a single field
   */
  async updateField<K extends keyof UserProgress>(
    field: K,
    value: UserProgress[K]
  ): Promise<void> {
    const progress = await this.get();
    progress[field] = value;
    await this.save(progress);
  }

  /**
   * Unlock a new level
   */
  async unlockLevel(levelId: string): Promise<void> {
    const progress = await this.get();

    if (!progress.unlockedLevels.includes(levelId)) {
      progress.unlockedLevels.push(levelId);
      await this.save(progress);
    }
  }

  /**
   * Check if a level is unlocked
   */
  async isLevelUnlocked(levelId: string): Promise<boolean> {
    const progress = await this.get();
    return progress.unlockedLevels.includes(levelId);
  }

  /**
   * Update streak based on last session date
   * Call this when a session is completed
   */
  async updateStreak(): Promise<number> {
    const progress = await this.get();
    const today = new Date();

    if (progress.lastSessionDate === null) {
      // First session ever
      progress.currentStreak = 1;
    } else if (isSameDay(progress.lastSessionDate, today)) {
      // Already trained today - streak unchanged
      // Do nothing
    } else if (isConsecutiveDay(progress.lastSessionDate, today)) {
      // Trained yesterday - increment streak
      progress.currentStreak += 1;
    } else {
      // Missed a day - reset streak
      progress.currentStreak = 1;
    }

    // Update longest streak if current is higher
    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }

    progress.lastSessionDate = today;
    await this.save(progress);

    return progress.currentStreak;
  }
}
