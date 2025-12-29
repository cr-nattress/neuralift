/**
 * Level Configuration
 *
 * Defines all available training levels with their settings.
 */

import type { NBackLevel } from '../domain/value-objects/NBackLevel';
import type { TrainingMode } from '../domain/value-objects/TrainingMode';

export interface LevelConfig {
  readonly id: string;
  readonly name: string;
  readonly nBack: NBackLevel;
  readonly mode: TrainingMode;
  readonly description: string;
  readonly unlockCriteria?: {
    requiredLevel: string;
    minAccuracy: number;
  };
}

export const LEVELS: readonly LevelConfig[] = [
  // Single Position Levels
  {
    id: 'position-1',
    name: '1-Back Position',
    nBack: 1,
    mode: 'single-position',
    description: 'Match positions from 1 step ago',
  },
  {
    id: 'position-2',
    name: '2-Back Position',
    nBack: 2,
    mode: 'single-position',
    description: 'Match positions from 2 steps ago',
    unlockCriteria: { requiredLevel: 'position-1', minAccuracy: 80 },
  },
  // Single Audio Levels
  {
    id: 'audio-1',
    name: '1-Back Audio',
    nBack: 1,
    mode: 'single-audio',
    description: 'Match letters from 1 step ago',
  },
  {
    id: 'audio-2',
    name: '2-Back Audio',
    nBack: 2,
    mode: 'single-audio',
    description: 'Match letters from 2 steps ago',
    unlockCriteria: { requiredLevel: 'audio-1', minAccuracy: 80 },
  },
  // Dual N-Back Levels
  {
    id: 'dual-2',
    name: 'Dual 2-Back',
    nBack: 2,
    mode: 'dual',
    description: 'Match both position and audio from 2 steps ago',
    unlockCriteria: { requiredLevel: 'position-2', minAccuracy: 75 },
  },
  {
    id: 'dual-3',
    name: 'Dual 3-Back',
    nBack: 3,
    mode: 'dual',
    description: 'Match both position and audio from 3 steps ago',
    unlockCriteria: { requiredLevel: 'dual-2', minAccuracy: 80 },
  },
] as const;

export function getLevelById(id: string): LevelConfig | undefined {
  return LEVELS.find((level) => level.id === id);
}

export function getStarterLevels(): LevelConfig[] {
  return LEVELS.filter((level) => !level.unlockCriteria);
}
