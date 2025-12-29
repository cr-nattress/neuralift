/**
 * Application Constants
 *
 * Core configuration values used throughout the application.
 */

/** Default trial duration in milliseconds */
export const DEFAULT_TRIAL_DURATION_MS = 3000;

/** Default number of trials per session */
export const DEFAULT_TRIALS_PER_SESSION = 20;

/** Minimum accuracy required for level progression */
export const MIN_ACCURACY_FOR_PROGRESSION = 80;

/** Target match percentage in sequences (roughly 30-40%) */
export const TARGET_MATCH_PERCENTAGE = 0.35;

/** Available letters for audio stimuli */
export const AUDIO_LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'] as const;

/** Grid size (3x3) */
export const GRID_SIZE = 3;

/** Total grid positions */
export const TOTAL_POSITIONS = GRID_SIZE * GRID_SIZE;

/** Maximum N-back level supported */
export const MAX_N_BACK_LEVEL = 9;

/** Minimum sessions for reliable streak calculation */
export const MIN_SESSIONS_FOR_STREAK = 1;

/** Session timeout in milliseconds (auto-pause after inactivity) */
export const SESSION_TIMEOUT_MS = 30000;
