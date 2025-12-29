/**
 * IProgressRepository Port
 *
 * Interface for persisting and retrieving user progress data.
 */

/**
 * User progress data structure
 */
export interface UserProgress {
  /** Current level ID the user is on */
  currentLevel: string;
  /** Array of unlocked level IDs */
  unlockedLevels: string[];
  /** Total number of completed sessions */
  totalSessions: number;
  /** Total training time in milliseconds */
  totalTime: number;
  /** Current consecutive day streak */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Date of last session, null if never */
  lastSessionDate: Date | null;
}

export interface IProgressRepository {
  /**
   * Get the user's current progress
   */
  get(): Promise<UserProgress>;

  /**
   * Save the user's progress
   */
  save(progress: UserProgress): Promise<void>;

  /**
   * Reset progress to defaults
   */
  reset(): Promise<void>;

  /**
   * Update a single field (convenience method)
   */
  updateField<K extends keyof UserProgress>(
    field: K,
    value: UserProgress[K]
  ): Promise<void>;

  /**
   * Unlock a new level
   */
  unlockLevel(levelId: string): Promise<void>;

  /**
   * Check if a level is unlocked
   */
  isLevelUnlocked(levelId: string): Promise<boolean>;

  /**
   * Update streak based on last session date
   * Returns the updated streak value
   */
  updateStreak(): Promise<number>;
}
