/**
 * TrainingMode Value Object
 *
 * Represents the type of N-back training:
 * - single-position: Track position matches only
 * - single-audio: Track audio (letter) matches only
 * - dual: Track both position AND audio matches simultaneously
 */

export type TrainingMode = 'single-position' | 'single-audio' | 'dual';

/**
 * All available training modes
 */
export const TRAINING_MODES: readonly TrainingMode[] = [
  'single-position',
  'single-audio',
  'dual',
] as const;

/**
 * Validates if a string is a valid training mode
 */
export function isValidTrainingMode(value: string): value is TrainingMode {
  return TRAINING_MODES.includes(value as TrainingMode);
}

/**
 * Returns human-readable name for a training mode
 */
export function getTrainingModeName(mode: TrainingMode): string {
  switch (mode) {
    case 'single-position':
      return 'Position Only';
    case 'single-audio':
      return 'Audio Only';
    case 'dual':
      return 'Dual N-Back';
  }
}

/**
 * Checks if a training mode includes position tracking
 */
export function modeIncludesPosition(mode: TrainingMode): boolean {
  return mode === 'single-position' || mode === 'dual';
}

/**
 * Checks if a training mode includes audio tracking
 */
export function modeIncludesAudio(mode: TrainingMode): boolean {
  return mode === 'single-audio' || mode === 'dual';
}
