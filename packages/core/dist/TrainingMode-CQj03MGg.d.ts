/**
 * NBackLevel Value Object
 *
 * Represents the N-back difficulty level (1-back through 9-back).
 * Higher values require remembering stimuli from further back.
 */
type NBackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
/**
 * Validates if a number is a valid N-back level
 */
declare function isValidNBackLevel(value: number): value is NBackLevel;
/**
 * Creates an NBackLevel from a number, throwing if invalid
 */
declare function createNBackLevel(value: number): NBackLevel;

/**
 * TrainingMode Value Object
 *
 * Represents the type of N-back training:
 * - single-position: Track position matches only
 * - single-audio: Track audio (letter) matches only
 * - dual: Track both position AND audio matches simultaneously
 */
type TrainingMode = 'single-position' | 'single-audio' | 'dual';
/**
 * All available training modes
 */
declare const TRAINING_MODES: readonly TrainingMode[];
/**
 * Validates if a string is a valid training mode
 */
declare function isValidTrainingMode(value: string): value is TrainingMode;
/**
 * Returns human-readable name for a training mode
 */
declare function getTrainingModeName(mode: TrainingMode): string;
/**
 * Checks if a training mode includes position tracking
 */
declare function modeIncludesPosition(mode: TrainingMode): boolean;
/**
 * Checks if a training mode includes audio tracking
 */
declare function modeIncludesAudio(mode: TrainingMode): boolean;

export { type NBackLevel as N, type TrainingMode as T, TRAINING_MODES as a, isValidTrainingMode as b, createNBackLevel as c, modeIncludesAudio as d, getTrainingModeName as g, isValidNBackLevel as i, modeIncludesPosition as m };
