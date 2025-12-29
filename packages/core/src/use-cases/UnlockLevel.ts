/**
 * UnlockLevel Use Case
 *
 * Unlocks a new training level based on performance.
 */

// Placeholder - will be implemented in Epic 03
export interface UnlockLevelInput {
  levelId: string;
}

export interface UnlockLevel {
  execute(input: UnlockLevelInput): Promise<void>;
}
