/**
 * Level Entity
 *
 * Represents a training level configuration.
 * Defines N-back difficulty and mode settings.
 */

import type { NBackLevel } from '../value-objects/NBackLevel';
import type { TrainingMode } from '../value-objects/TrainingMode';

/**
 * Criteria for unlocking a level
 */
export interface UnlockCriteria {
  readonly requiredLevel: string;
  readonly minAccuracy: number;
}

/**
 * Level configuration
 */
export interface Level {
  readonly id: string;
  readonly name: string;
  readonly nBack: NBackLevel;
  readonly mode: TrainingMode;
  readonly description: string;
  readonly unlockCriteria?: UnlockCriteria;
}

/**
 * User progress on a specific level
 */
export interface LevelProgress {
  readonly levelId: string;
  readonly bestAccuracy: number;
  readonly totalSessions: number;
  readonly lastPlayedAt: Date | null;
  readonly unlocked: boolean;
}

/**
 * Creates a Level from configuration
 */
export function createLevel(
  id: string,
  name: string,
  nBack: NBackLevel,
  mode: TrainingMode,
  description: string,
  unlockCriteria?: UnlockCriteria
): Level {
  const level: Level = {
    id,
    name,
    nBack,
    mode,
    description,
  };

  if (unlockCriteria !== undefined) {
    return { ...level, unlockCriteria };
  }

  return level;
}

/**
 * Checks if a level requires unlocking
 */
export function levelRequiresUnlock(level: Level): boolean {
  return level.unlockCriteria !== undefined;
}

/**
 * Checks if unlock criteria are met
 */
export function isLevelUnlockCriteriaMet(
  level: Level,
  levelProgresses: Map<string, LevelProgress>
): boolean {
  if (!level.unlockCriteria) {
    return true; // No unlock criteria means always unlocked
  }

  const requiredProgress = levelProgresses.get(level.unlockCriteria.requiredLevel);
  if (!requiredProgress) {
    return false;
  }

  return requiredProgress.bestAccuracy >= level.unlockCriteria.minAccuracy;
}
