import { N as NBackLevel, T as TrainingMode } from '../TrainingMode-CQj03MGg.js';

/**
 * Level Configuration
 *
 * Defines all available training levels with their settings.
 */

interface LevelConfig {
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
declare const LEVELS: readonly LevelConfig[];
declare function getLevelById(id: string): LevelConfig | undefined;
declare function getStarterLevels(): LevelConfig[];

/**
 * Application Constants
 *
 * Core configuration values used throughout the application.
 */
/** Default trial duration in milliseconds */
declare const DEFAULT_TRIAL_DURATION_MS = 3000;
/** Default number of trials per session */
declare const DEFAULT_TRIALS_PER_SESSION = 20;
/** Minimum accuracy required for level progression */
declare const MIN_ACCURACY_FOR_PROGRESSION = 80;
/** Target match percentage in sequences (roughly 30-40%) */
declare const TARGET_MATCH_PERCENTAGE = 0.35;
/** Available letters for audio stimuli */
declare const AUDIO_LETTERS: readonly ["C", "H", "K", "L", "Q", "R", "S", "T"];
/** Grid size (3x3) */
declare const GRID_SIZE = 3;
/** Total grid positions */
declare const TOTAL_POSITIONS: number;
/** Maximum N-back level supported */
declare const MAX_N_BACK_LEVEL = 9;
/** Minimum sessions for reliable streak calculation */
declare const MIN_SESSIONS_FOR_STREAK = 1;
/** Session timeout in milliseconds (auto-pause after inactivity) */
declare const SESSION_TIMEOUT_MS = 30000;

export { AUDIO_LETTERS, DEFAULT_TRIALS_PER_SESSION, DEFAULT_TRIAL_DURATION_MS, GRID_SIZE, LEVELS, type LevelConfig, MAX_N_BACK_LEVEL, MIN_ACCURACY_FOR_PROGRESSION, MIN_SESSIONS_FOR_STREAK, SESSION_TIMEOUT_MS, TARGET_MATCH_PERCENTAGE, TOTAL_POSITIONS, getLevelById, getStarterLevels };
