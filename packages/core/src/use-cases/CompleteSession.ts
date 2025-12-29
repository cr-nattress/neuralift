/**
 * CompleteSession Use Case
 *
 * Finalizes a session and calculates performance metrics.
 */

// Placeholder - will be implemented in Epic 03
export interface CompleteSessionInput {
  sessionId: string;
}

export interface CompleteSessionOutput {
  accuracy: number;
  dPrime: number;
  levelUp: boolean;
}

export interface CompleteSession {
  execute(input: CompleteSessionInput): Promise<CompleteSessionOutput>;
}
