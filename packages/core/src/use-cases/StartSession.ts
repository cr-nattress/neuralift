/**
 * StartSession Use Case
 *
 * Initializes a new training session with the specified level.
 */

// Placeholder - will be implemented in Epic 03
export interface StartSessionInput {
  levelId: string;
}

export interface StartSessionOutput {
  sessionId: string;
}

export interface StartSession {
  execute(input: StartSessionInput): Promise<StartSessionOutput>;
}
