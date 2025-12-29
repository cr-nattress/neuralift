'use strict';

// src/config/levels.ts
var LEVELS = [
  // Single Position Levels
  {
    id: "position-1",
    name: "1-Back Position",
    nBack: 1,
    mode: "single-position",
    description: "Match positions from 1 step ago"
  },
  {
    id: "position-2",
    name: "2-Back Position",
    nBack: 2,
    mode: "single-position",
    description: "Match positions from 2 steps ago",
    unlockCriteria: { requiredLevel: "position-1", minAccuracy: 80 }
  },
  // Single Audio Levels
  {
    id: "audio-1",
    name: "1-Back Audio",
    nBack: 1,
    mode: "single-audio",
    description: "Match letters from 1 step ago"
  },
  {
    id: "audio-2",
    name: "2-Back Audio",
    nBack: 2,
    mode: "single-audio",
    description: "Match letters from 2 steps ago",
    unlockCriteria: { requiredLevel: "audio-1", minAccuracy: 80 }
  },
  // Dual N-Back Levels
  {
    id: "dual-2",
    name: "Dual 2-Back",
    nBack: 2,
    mode: "dual",
    description: "Match both position and audio from 2 steps ago",
    unlockCriteria: { requiredLevel: "position-2", minAccuracy: 75 }
  },
  {
    id: "dual-3",
    name: "Dual 3-Back",
    nBack: 3,
    mode: "dual",
    description: "Match both position and audio from 3 steps ago",
    unlockCriteria: { requiredLevel: "dual-2", minAccuracy: 80 }
  }
];
function getLevelById(id) {
  return LEVELS.find((level) => level.id === id);
}
function getStarterLevels() {
  return LEVELS.filter((level) => !level.unlockCriteria);
}

// src/config/constants.ts
var DEFAULT_TRIAL_DURATION_MS = 3e3;
var DEFAULT_TRIALS_PER_SESSION = 20;
var MIN_ACCURACY_FOR_PROGRESSION = 80;
var TARGET_MATCH_PERCENTAGE = 0.35;
var AUDIO_LETTERS = ["C", "H", "K", "L", "Q", "R", "S", "T"];
var GRID_SIZE = 3;
var TOTAL_POSITIONS = GRID_SIZE * GRID_SIZE;
var MAX_N_BACK_LEVEL = 9;
var MIN_SESSIONS_FOR_STREAK = 1;
var SESSION_TIMEOUT_MS = 3e4;

exports.AUDIO_LETTERS = AUDIO_LETTERS;
exports.DEFAULT_TRIALS_PER_SESSION = DEFAULT_TRIALS_PER_SESSION;
exports.DEFAULT_TRIAL_DURATION_MS = DEFAULT_TRIAL_DURATION_MS;
exports.GRID_SIZE = GRID_SIZE;
exports.LEVELS = LEVELS;
exports.MAX_N_BACK_LEVEL = MAX_N_BACK_LEVEL;
exports.MIN_ACCURACY_FOR_PROGRESSION = MIN_ACCURACY_FOR_PROGRESSION;
exports.MIN_SESSIONS_FOR_STREAK = MIN_SESSIONS_FOR_STREAK;
exports.SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MS;
exports.TARGET_MATCH_PERCENTAGE = TARGET_MATCH_PERCENTAGE;
exports.TOTAL_POSITIONS = TOTAL_POSITIONS;
exports.getLevelById = getLevelById;
exports.getStarterLevels = getStarterLevels;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map