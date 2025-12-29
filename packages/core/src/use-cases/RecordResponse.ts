/**
 * RecordResponse Use Case
 *
 * Records a user's response to a trial stimulus.
 */

// Placeholder - will be implemented in Epic 03
export interface RecordResponseInput {
  sessionId: string;
  trialIndex: number;
  positionMatch: boolean;
  audioMatch: boolean;
}

export interface RecordResponse {
  execute(input: RecordResponseInput): Promise<void>;
}
