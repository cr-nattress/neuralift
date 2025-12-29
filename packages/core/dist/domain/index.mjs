// src/domain/entities/Trial.ts
var Trial = class _Trial {
  constructor(data) {
    this.data = data;
  }
  /**
   * Creates a new Trial
   */
  static create(id, position, audioLetter, isPositionMatch, isAudioMatch) {
    return new _Trial({
      id,
      position,
      audioLetter,
      isPositionMatch,
      isAudioMatch,
      userPositionResponse: null,
      userAudioResponse: null,
      positionResponseTime: null,
      audioResponseTime: null,
      stimulusTimestamp: Date.now()
    });
  }
  /**
   * Creates a Trial from existing data (for deserialization)
   */
  static fromData(data) {
    return new _Trial(data);
  }
  // Getters
  get id() {
    return this.data.id;
  }
  get position() {
    return this.data.position;
  }
  get audioLetter() {
    return this.data.audioLetter;
  }
  get isPositionMatch() {
    return this.data.isPositionMatch;
  }
  get isAudioMatch() {
    return this.data.isAudioMatch;
  }
  get userPositionResponse() {
    return this.data.userPositionResponse;
  }
  get userAudioResponse() {
    return this.data.userAudioResponse;
  }
  get positionResponseTime() {
    return this.data.positionResponseTime;
  }
  get audioResponseTime() {
    return this.data.audioResponseTime;
  }
  get stimulusTimestamp() {
    return this.data.stimulusTimestamp;
  }
  /**
   * Records a position response, returning a new Trial instance
   */
  recordPositionResponse(response) {
    const responseTime = Date.now() - this.data.stimulusTimestamp;
    return new _Trial({
      ...this.data,
      userPositionResponse: response,
      positionResponseTime: responseTime
    });
  }
  /**
   * Records an audio response, returning a new Trial instance
   */
  recordAudioResponse(response) {
    const responseTime = Date.now() - this.data.stimulusTimestamp;
    return new _Trial({
      ...this.data,
      userAudioResponse: response,
      audioResponseTime: responseTime
    });
  }
  /**
   * Checks if position response was correct
   */
  isPositionCorrect() {
    if (this.data.userPositionResponse === null) {
      return !this.data.isPositionMatch;
    }
    return this.data.userPositionResponse === this.data.isPositionMatch;
  }
  /**
   * Checks if audio response was correct
   */
  isAudioCorrect() {
    if (this.data.userAudioResponse === null) {
      return !this.data.isAudioMatch;
    }
    return this.data.userAudioResponse === this.data.isAudioMatch;
  }
  /**
   * Gets position response category for stats calculation
   */
  getPositionCategory() {
    const responded = this.data.userPositionResponse === true;
    const isMatch = this.data.isPositionMatch;
    if (isMatch && responded) return "hit";
    if (isMatch && !responded) return "miss";
    if (!isMatch && responded) return "falseAlarm";
    return "correctRejection";
  }
  /**
   * Gets audio response category for stats calculation
   */
  getAudioCategory() {
    const responded = this.data.userAudioResponse === true;
    const isMatch = this.data.isAudioMatch;
    if (isMatch && responded) return "hit";
    if (isMatch && !responded) return "miss";
    if (!isMatch && responded) return "falseAlarm";
    return "correctRejection";
  }
  /**
   * Checks if any response has been recorded
   */
  hasResponse() {
    return this.data.userPositionResponse !== null || this.data.userAudioResponse !== null;
  }
  /**
   * Serializes the trial to JSON
   */
  toJSON() {
    return { ...this.data };
  }
};

// src/domain/value-objects/PerformanceStats.ts
function zScore(p) {
  const clampedP = Math.max(1e-3, Math.min(0.999, p));
  const a1 = -39.6968302866538;
  const a2 = 220.946098424521;
  const a3 = -275.928510446969;
  const a4 = 138.357751867269;
  const a5 = -30.6647980661472;
  const a6 = 2.50662823884;
  const b1 = -54.4760987982241;
  const b2 = 161.585836858041;
  const b3 = -155.698979859887;
  const b4 = 66.8013118877197;
  const b5 = -13.2806815528857;
  const c1 = -0.00778489400243029;
  const c2 = -0.322396458041136;
  const c3 = -2.40075827716184;
  const c4 = -2.54973253934373;
  const c5 = 4.37466414146497;
  const c6 = 2.93816398269878;
  const d1 = 0.00778469570904146;
  const d2 = 0.32246712907004;
  const d3 = 2.445134137143;
  const d4 = 3.75440866190742;
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q;
  let r;
  if (clampedP < pLow) {
    q = Math.sqrt(-2 * Math.log(clampedP));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (clampedP <= pHigh) {
    q = clampedP - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - clampedP));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}
function createPerformanceStats(counts) {
  const { hits, misses, falseAlarms, correctRejections, responseTimes } = counts;
  const totalSignals = hits + misses;
  const totalNoise = falseAlarms + correctRejections;
  const total = totalSignals + totalNoise;
  const hitRate = totalSignals > 0 ? hits / totalSignals : 0;
  const falseAlarmRate = totalNoise > 0 ? falseAlarms / totalNoise : 0;
  const dPrime = zScore(hitRate) - zScore(falseAlarmRate);
  const correctResponses = hits + correctRejections;
  const accuracy = total > 0 ? correctResponses / total * 100 : 0;
  const avgResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length : null;
  return {
    hits,
    misses,
    falseAlarms,
    correctRejections,
    hitRate,
    falseAlarmRate,
    dPrime,
    accuracy,
    avgResponseTime
  };
}
function createEmptyPerformanceStats() {
  return {
    hits: 0,
    misses: 0,
    falseAlarms: 0,
    correctRejections: 0,
    hitRate: 0,
    falseAlarmRate: 0,
    dPrime: 0,
    accuracy: 0,
    avgResponseTime: null
  };
}

// src/domain/value-objects/TrainingMode.ts
var TRAINING_MODES = [
  "single-position",
  "single-audio",
  "dual"
];
function isValidTrainingMode(value) {
  return TRAINING_MODES.includes(value);
}
function getTrainingModeName(mode) {
  switch (mode) {
    case "single-position":
      return "Position Only";
    case "single-audio":
      return "Audio Only";
    case "dual":
      return "Dual N-Back";
  }
}
function modeIncludesPosition(mode) {
  return mode === "single-position" || mode === "dual";
}
function modeIncludesAudio(mode) {
  return mode === "single-audio" || mode === "dual";
}

// src/domain/entities/Session.ts
var Session = class {
  sessionId;
  config;
  trials;
  currentTrialIndex;
  startTime;
  endTime;
  isCompleted;
  constructor(sessionId, config, trials) {
    this.sessionId = sessionId;
    this.config = config;
    this.trials = trials;
    this.currentTrialIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.isCompleted = false;
  }
  /**
   * Starts the session
   */
  start() {
    this.startTime = Date.now();
  }
  /**
   * Gets the session ID
   */
  getId() {
    return this.sessionId;
  }
  /**
   * Gets the session configuration
   */
  getConfig() {
    return this.config;
  }
  /**
   * Gets the current trial, or null if session is complete
   */
  getCurrentTrial() {
    if (this.currentTrialIndex >= this.trials.length) {
      return null;
    }
    const trial = this.trials[this.currentTrialIndex];
    return trial ?? null;
  }
  /**
   * Gets the current trial index
   */
  getCurrentTrialIndex() {
    return this.currentTrialIndex;
  }
  /**
   * Records a position response for the current trial
   */
  recordPositionResponse(response) {
    const currentTrial = this.trials[this.currentTrialIndex];
    if (!currentTrial) return;
    this.trials[this.currentTrialIndex] = currentTrial.recordPositionResponse(response);
  }
  /**
   * Records an audio response for the current trial
   */
  recordAudioResponse(response) {
    const currentTrial = this.trials[this.currentTrialIndex];
    if (!currentTrial) return;
    this.trials[this.currentTrialIndex] = currentTrial.recordAudioResponse(response);
  }
  /**
   * Advances to the next trial
   * @returns true if there are more trials, false if session is complete
   */
  advanceToNextTrial() {
    this.currentTrialIndex++;
    return this.currentTrialIndex < this.trials.length;
  }
  /**
   * Completes the session and returns results
   */
  complete() {
    this.endTime = Date.now();
    this.isCompleted = true;
    const duration = this.startTime ? this.endTime - this.startTime : 0;
    const positionStats = this.calculatePositionStats();
    const audioStats = this.calculateAudioStats();
    const combinedAccuracy = this.calculateCombinedAccuracy(positionStats, audioStats);
    return {
      sessionId: this.sessionId,
      levelId: this.config.levelId,
      mode: this.config.mode,
      nBack: this.config.nBack,
      timestamp: new Date(this.startTime ?? Date.now()),
      duration,
      trials: this.trials.map((t) => t.toJSON()),
      positionStats,
      audioStats,
      combinedAccuracy,
      completed: true
    };
  }
  /**
   * Gets session progress
   */
  getProgress() {
    const current = this.currentTrialIndex + 1;
    const total = this.trials.length;
    const percentage = total > 0 ? this.currentTrialIndex / total * 100 : 0;
    return { current, total, percentage };
  }
  /**
   * Checks if the session is complete
   */
  isSessionComplete() {
    return this.isCompleted || this.currentTrialIndex >= this.trials.length;
  }
  /**
   * Gets all trials
   */
  getTrials() {
    return this.trials;
  }
  calculatePositionStats() {
    if (!modeIncludesPosition(this.config.mode)) {
      return createEmptyPerformanceStats();
    }
    const counts = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejections: 0,
      responseTimes: []
    };
    for (const trial of this.trials) {
      const category = trial.getPositionCategory();
      switch (category) {
        case "hit":
          counts.hits++;
          break;
        case "miss":
          counts.misses++;
          break;
        case "falseAlarm":
          counts.falseAlarms++;
          break;
        case "correctRejection":
          counts.correctRejections++;
          break;
      }
      if (trial.positionResponseTime !== null) {
        counts.responseTimes.push(trial.positionResponseTime);
      }
    }
    return createPerformanceStats(counts);
  }
  calculateAudioStats() {
    if (!modeIncludesAudio(this.config.mode)) {
      return createEmptyPerformanceStats();
    }
    const counts = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejections: 0,
      responseTimes: []
    };
    for (const trial of this.trials) {
      const category = trial.getAudioCategory();
      switch (category) {
        case "hit":
          counts.hits++;
          break;
        case "miss":
          counts.misses++;
          break;
        case "falseAlarm":
          counts.falseAlarms++;
          break;
        case "correctRejection":
          counts.correctRejections++;
          break;
      }
      if (trial.audioResponseTime !== null) {
        counts.responseTimes.push(trial.audioResponseTime);
      }
    }
    return createPerformanceStats(counts);
  }
  calculateCombinedAccuracy(positionStats, audioStats) {
    const mode = this.config.mode;
    if (mode === "single-position") {
      return positionStats.accuracy;
    }
    if (mode === "single-audio") {
      return audioStats.accuracy;
    }
    return (positionStats.accuracy + audioStats.accuracy) / 2;
  }
  /**
   * Serializes session to result format
   */
  toJSON() {
    const positionStats = this.calculatePositionStats();
    const audioStats = this.calculateAudioStats();
    const combinedAccuracy = this.calculateCombinedAccuracy(positionStats, audioStats);
    const duration = this.startTime ? (this.endTime ?? Date.now()) - this.startTime : 0;
    return {
      sessionId: this.sessionId,
      levelId: this.config.levelId,
      mode: this.config.mode,
      nBack: this.config.nBack,
      timestamp: new Date(this.startTime ?? Date.now()),
      duration,
      trials: this.trials.map((t) => t.toJSON()),
      positionStats,
      audioStats,
      combinedAccuracy,
      completed: this.isCompleted
    };
  }
};

// src/domain/entities/Level.ts
function createLevel(id, name, nBack, mode, description, unlockCriteria) {
  const level = {
    id,
    name,
    nBack,
    mode,
    description
  };
  if (unlockCriteria !== void 0) {
    return { ...level, unlockCriteria };
  }
  return level;
}
function levelRequiresUnlock(level) {
  return level.unlockCriteria !== void 0;
}
function isLevelUnlockCriteriaMet(level, levelProgresses) {
  if (!level.unlockCriteria) {
    return true;
  }
  const requiredProgress = levelProgresses.get(level.unlockCriteria.requiredLevel);
  if (!requiredProgress) {
    return false;
  }
  return requiredProgress.bestAccuracy >= level.unlockCriteria.minAccuracy;
}

// src/domain/entities/UserProfile.ts
function createInitialUserProfile(id) {
  return {
    id,
    currentLevel: 1,
    totalSessions: 0,
    totalTrainingTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    preferences: {
      preferredTimeOfDay: null,
      averageSessionDuration: 0,
      preferredMode: null,
      sessionsPerWeek: 0
    },
    trends: {
      overallTrend: "stable",
      positionTrend: "stable",
      audioTrend: "stable",
      recentAccuracies: []
    },
    strengthsWeaknesses: {
      strongerModality: "balanced",
      consistentlyStrugglesAt: null,
      consistentlyExcelsAt: null
    },
    behavioralPatterns: {
      respondsQuicklyToPosition: false,
      respondsQuicklyToAudio: false,
      tendsToPressMatchTooOften: false,
      tendsToPressMatchTooRarely: false,
      performsBetterEarlyInSession: false,
      performsBetterLateInSession: false
    },
    lastUpdated: /* @__PURE__ */ new Date()
  };
}
function generateProfileSummary(profile) {
  const lines = [];
  lines.push(`Current N-back level: ${profile.currentLevel}`);
  lines.push(`Total sessions: ${profile.totalSessions}`);
  lines.push(`Training streak: ${profile.currentStreak} days`);
  if (profile.trends.overallTrend !== "stable") {
    lines.push(`Performance trend: ${profile.trends.overallTrend}`);
  }
  if (profile.strengthsWeaknesses.strongerModality !== "balanced") {
    lines.push(`Stronger at: ${profile.strengthsWeaknesses.strongerModality} tasks`);
  }
  if (profile.behavioralPatterns.tendsToPressMatchTooOften) {
    lines.push("Tendency: Over-reports matches (false alarms)");
  } else if (profile.behavioralPatterns.tendsToPressMatchTooRarely) {
    lines.push("Tendency: Under-reports matches (misses)");
  }
  if (profile.preferences.preferredTimeOfDay) {
    lines.push(`Prefers training: ${profile.preferences.preferredTimeOfDay}`);
  }
  return lines.join("\n");
}

// src/domain/value-objects/NBackLevel.ts
function isValidNBackLevel(value) {
  return Number.isInteger(value) && value >= 1 && value <= 9;
}
function createNBackLevel(value) {
  if (!isValidNBackLevel(value)) {
    throw new Error(`Invalid N-back level: ${value}. Must be between 1 and 9.`);
  }
  return value;
}

// src/config/constants.ts
var GRID_SIZE = 3;
var TOTAL_POSITIONS = GRID_SIZE * GRID_SIZE;

// src/domain/value-objects/Position.ts
function isValidPositionIndex(value) {
  return Number.isInteger(value) && value >= 0 && value < TOTAL_POSITIONS;
}
function createPosition(index) {
  if (!isValidPositionIndex(index)) {
    throw new Error(`Invalid position index: ${index}. Must be between 0 and ${TOTAL_POSITIONS - 1}.`);
  }
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
    index
  };
}
function createPositionFromCoords(row, col) {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    throw new Error(`Invalid position coordinates: (${row}, ${col})`);
  }
  const index = row * GRID_SIZE + col;
  return { row, col, index };
}
function positionsEqual(a, b) {
  return a.index === b.index;
}
function getAllPositionIndices() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8];
}
function getRandomPositionIndex() {
  return Math.floor(Math.random() * TOTAL_POSITIONS);
}

// src/domain/events/SessionCompleted.ts
function createSessionCompletedEvent(aggregateId, levelId, accuracy, duration) {
  return {
    type: "SESSION_COMPLETED",
    timestamp: /* @__PURE__ */ new Date(),
    aggregateId,
    levelId,
    accuracy,
    duration
  };
}

export { Session, TRAINING_MODES, Trial, createEmptyPerformanceStats, createInitialUserProfile, createLevel, createNBackLevel, createPerformanceStats, createPosition, createPositionFromCoords, createSessionCompletedEvent, generateProfileSummary, getAllPositionIndices, getRandomPositionIndex, getTrainingModeName, isLevelUnlockCriteriaMet, isValidNBackLevel, isValidPositionIndex, isValidTrainingMode, levelRequiresUnlock, modeIncludesAudio, modeIncludesPosition, positionsEqual };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map