/**
 * NBackLevel Value Object
 *
 * Represents the N-back difficulty level (1-back through 9-back).
 * Higher values require remembering stimuli from further back.
 */

export type NBackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Validates if a number is a valid N-back level
 */
export function isValidNBackLevel(value: number): value is NBackLevel {
  return Number.isInteger(value) && value >= 1 && value <= 9;
}

/**
 * Creates an NBackLevel from a number, throwing if invalid
 */
export function createNBackLevel(value: number): NBackLevel {
  if (!isValidNBackLevel(value)) {
    throw new Error(`Invalid N-back level: ${value}. Must be between 1 and 9.`);
  }
  return value;
}
