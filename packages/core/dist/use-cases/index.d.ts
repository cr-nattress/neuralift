import { U as UserProfile } from '../UserProfile-DlU5DO_m.js';
import '../TrainingMode-CQj03MGg.js';

/**
 * StartSession Use Case
 *
 * Initializes a new training session with the specified level.
 */
interface StartSessionInput {
    levelId: string;
}
interface StartSessionOutput {
    sessionId: string;
}
interface StartSession {
    execute(input: StartSessionInput): Promise<StartSessionOutput>;
}

/**
 * RecordResponse Use Case
 *
 * Records a user's response to a trial stimulus.
 */
interface RecordResponseInput {
    sessionId: string;
    trialIndex: number;
    positionMatch: boolean;
    audioMatch: boolean;
}
interface RecordResponse {
    execute(input: RecordResponseInput): Promise<void>;
}

/**
 * CompleteSession Use Case
 *
 * Finalizes a session and calculates performance metrics.
 */
interface CompleteSessionInput {
    sessionId: string;
}
interface CompleteSessionOutput {
    accuracy: number;
    dPrime: number;
    levelUp: boolean;
}
interface CompleteSession {
    execute(input: CompleteSessionInput): Promise<CompleteSessionOutput>;
}

/**
 * GetRecommendations Use Case
 *
 * Generates personalized training recommendations.
 */
interface RecommendationOutput {
    suggestedLevel: string;
    message: string;
}
interface GetRecommendations {
    execute(): Promise<RecommendationOutput>;
}

/**
 * UnlockLevel Use Case
 *
 * Unlocks a new training level based on performance.
 */
interface UnlockLevelInput {
    levelId: string;
}
interface UnlockLevel {
    execute(input: UnlockLevelInput): Promise<void>;
}

/**
 * BuildUserProfile Use Case
 *
 * Builds a user profile from session history for LLM feedback.
 */

interface BuildUserProfile {
    execute(): Promise<UserProfile>;
}

export type { BuildUserProfile, CompleteSession, CompleteSessionInput, CompleteSessionOutput, GetRecommendations, RecommendationOutput, RecordResponse, RecordResponseInput, StartSession, StartSessionInput, StartSessionOutput, UnlockLevel, UnlockLevelInput };
