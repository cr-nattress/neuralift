'use strict';

// src/domain/value-objects/TrainingMode.ts
function modeIncludesPosition(mode) {
  return mode === "single-position" || mode === "dual";
}
function modeIncludesAudio(mode) {
  return mode === "single-audio" || mode === "dual";
}

// src/services/SequenceGenerator.ts
function createSeededRandom(seed) {
  let state = seed;
  return () => {
    state = state + 1831565813 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
var SequenceGenerator = class _SequenceGenerator {
  /**
   * Available letters for audio stimuli
   * Phonetically distinct to avoid confusion when spoken
   * Excludes similar-sounding pairs (B/D, C/E, F/S, M/N, P/B, etc.)
   */
  static LETTERS = ["C", "H", "K", "L", "Q", "R", "S", "T"];
  /** Number of positions in the 3x3 grid */
  static GRID_SIZE = 9;
  /** Default match probability */
  static DEFAULT_MATCH_PROBABILITY = 0.3;
  /**
   * Generates a sequence of trials based on the provided configuration
   */
  generate(config) {
    const {
      nBack,
      trialCount,
      mode,
      positionMatchProbability = _SequenceGenerator.DEFAULT_MATCH_PROBABILITY,
      audioMatchProbability = _SequenceGenerator.DEFAULT_MATCH_PROBABILITY,
      seed
    } = config;
    const random = seed !== void 0 ? createSeededRandom(seed) : Math.random.bind(Math);
    const trials = [];
    const positions = [];
    const letters = [];
    const includesPosition = modeIncludesPosition(mode);
    const includesAudio = modeIncludesAudio(mode);
    for (let i = 0; i < trialCount; i++) {
      let position;
      let letter;
      let isPositionMatch = false;
      let isAudioMatch = false;
      const canBeMatch = i >= nBack;
      const shouldBePositionMatch = canBeMatch && includesPosition && random() < positionMatchProbability && !this.wasRecentMatch(trials, "position", nBack);
      const shouldBeAudioMatch = canBeMatch && includesAudio && random() < audioMatchProbability && !this.wasRecentMatch(trials, "audio", nBack);
      if (shouldBePositionMatch && positions.length >= nBack) {
        position = positions[i - nBack];
        isPositionMatch = true;
      } else {
        const excludePosition = canBeMatch && positions.length >= nBack ? positions[i - nBack] : -1;
        position = this.randomPositionExcluding(excludePosition, random);
      }
      if (shouldBeAudioMatch && letters.length >= nBack) {
        letter = letters[i - nBack];
        isAudioMatch = true;
      } else {
        const excludeLetter = canBeMatch && letters.length >= nBack ? letters[i - nBack] : "";
        letter = this.randomLetterExcluding(excludeLetter, random);
      }
      positions.push(position);
      letters.push(letter);
      trials.push({
        position,
        audioLetter: letter,
        isPositionMatch,
        isAudioMatch
      });
    }
    return trials;
  }
  /**
   * Checks if there was a match in the most recent trial
   * Used to prevent consecutive matches which create predictable patterns
   */
  wasRecentMatch(trials, type, nBack) {
    if (trials.length === 0) return false;
    const lastTrial = trials[trials.length - 1];
    return type === "position" ? lastTrial.isPositionMatch : lastTrial.isAudioMatch;
  }
  /**
   * Generates a random position, excluding the specified position
   */
  randomPositionExcluding(exclude, random) {
    let pos;
    do {
      pos = Math.floor(random() * _SequenceGenerator.GRID_SIZE);
    } while (pos === exclude);
    return pos;
  }
  /**
   * Generates a random letter, excluding the specified letter
   */
  randomLetterExcluding(exclude, random) {
    let letter;
    do {
      letter = _SequenceGenerator.LETTERS[Math.floor(random() * _SequenceGenerator.LETTERS.length)];
    } while (letter === exclude);
    return letter;
  }
  /**
   * Returns the available letters used for audio stimuli
   */
  static getAvailableLetters() {
    return _SequenceGenerator.LETTERS;
  }
  /**
   * Returns the grid size (number of positions)
   */
  static getGridSize() {
    return _SequenceGenerator.GRID_SIZE;
  }
};
function createSequenceGenerator() {
  return new SequenceGenerator();
}

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

// src/services/ScoringService.ts
var ScoringService = class {
  /**
   * Calculate performance statistics from a set of trial results
   */
  calculateStats(trials) {
    if (trials.length === 0) {
      return createEmptyPerformanceStats();
    }
    const counts = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejections: 0,
      responseTimes: []
    };
    for (const trial of trials) {
      const userResponded = trial.userResponse === true;
      if (trial.isMatch) {
        if (userResponded) {
          counts.hits++;
        } else {
          counts.misses++;
        }
      } else {
        if (userResponded) {
          counts.falseAlarms++;
        } else {
          counts.correctRejections++;
        }
      }
      if (trial.responseTime !== null) {
        counts.responseTimes.push(trial.responseTime);
      }
    }
    return createPerformanceStats(counts);
  }
  /**
   * Calculate performance statistics with log-linear correction
   * This version applies correction for extreme rates (0 or 1)
   * to prevent infinite d-prime values
   */
  calculateStatsWithCorrection(trials) {
    if (trials.length === 0) {
      return createEmptyPerformanceStats();
    }
    let hits = 0;
    let misses = 0;
    let falseAlarms = 0;
    let correctRejections = 0;
    const responseTimes = [];
    for (const trial of trials) {
      const userResponded = trial.userResponse === true;
      if (trial.isMatch) {
        if (userResponded) {
          hits++;
        } else {
          misses++;
        }
      } else {
        if (userResponded) {
          falseAlarms++;
        } else {
          correctRejections++;
        }
      }
      if (trial.responseTime !== null) {
        responseTimes.push(trial.responseTime);
      }
    }
    const totalSignals = hits + misses;
    const totalNoise = falseAlarms + correctRejections;
    const total = totalSignals + totalNoise;
    const hitRate = totalSignals > 0 ? (hits + 0.5) / (totalSignals + 1) : 0.5;
    const falseAlarmRate = totalNoise > 0 ? (falseAlarms + 0.5) / (totalNoise + 1) : 0.5;
    const dPrime = this.calculateDPrime(hitRate, falseAlarmRate);
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
  /**
   * Calculate d-prime using inverse normal CDF
   * d' = Z(hitRate) - Z(falseAlarmRate)
   */
  calculateDPrime(hitRate, falseAlarmRate) {
    const clampedHR = Math.max(0.01, Math.min(0.99, hitRate));
    const clampedFAR = Math.max(0.01, Math.min(0.99, falseAlarmRate));
    const zHR = this.inverseNormalCDF(clampedHR);
    const zFAR = this.inverseNormalCDF(clampedFAR);
    return Number((zHR - zFAR).toFixed(2));
  }
  /**
   * Approximate inverse normal CDF (probit function)
   * Using Abramowitz and Stegun approximation
   */
  inverseNormalCDF(p) {
    const a = [
      -39.69683028665376,
      220.9460984245205,
      -275.9285104469687,
      138.357751867269,
      -30.66479806614716,
      2.506628277459239
    ];
    const b = [
      -54.47609879822406,
      161.5858368580409,
      -155.6989798598866,
      66.80131188771972,
      -13.28068155288572
    ];
    const c = [
      -0.007784894002430293,
      -0.3223964580411365,
      -2.400758277161838,
      -2.549732539343734,
      4.374664141464968,
      2.938163982698783
    ];
    const d = [
      0.007784695709041462,
      0.3224671290700398,
      2.445134137142996,
      3.754408661907416
    ];
    const pLow = 0.02425;
    const pHigh = 1 - pLow;
    let q;
    let r;
    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
  }
  /**
   * Calculate full session result from position and audio trials
   */
  calculateSessionResult(positionTrials, audioTrials, mode) {
    const positionStats = this.calculateStatsWithCorrection(positionTrials);
    const audioStats = this.calculateStatsWithCorrection(audioTrials);
    let combinedAccuracy;
    let combinedDPrime;
    switch (mode) {
      case "single-position":
        combinedAccuracy = positionStats.accuracy;
        combinedDPrime = positionStats.dPrime;
        break;
      case "single-audio":
        combinedAccuracy = audioStats.accuracy;
        combinedDPrime = audioStats.dPrime;
        break;
      case "dual":
        combinedAccuracy = (positionStats.accuracy + audioStats.accuracy) / 2;
        combinedDPrime = (positionStats.dPrime + audioStats.dPrime) / 2;
        break;
    }
    return {
      positionStats,
      audioStats,
      combinedAccuracy,
      combinedDPrime
    };
  }
  /**
   * Calculate session result from dual trial results
   */
  calculateDualSessionResult(trials, mode) {
    const positionTrials = trials.map((t) => t.position);
    const audioTrials = trials.map((t) => t.audio);
    return this.calculateSessionResult(positionTrials, audioTrials, mode);
  }
  /**
   * Determine performance level based on d-prime
   * Used for progression decisions
   */
  getPerformanceLevel(dPrime) {
    if (dPrime < 1) return "poor";
    if (dPrime < 2) return "fair";
    if (dPrime < 3) return "good";
    return "excellent";
  }
  /**
   * Check if performance meets advancement criteria
   * Default threshold is d-prime >= 2.0
   */
  meetsAdvancementCriteria(dPrime, threshold = 2) {
    return dPrime >= threshold;
  }
};
function createScoringService() {
  return new ScoringService();
}

// src/services/ProfileAnalyzer.ts
var ProfileAnalyzer = class {
  /**
   * Build a comprehensive behavioral profile
   */
  buildBehavioralProfile(sessions, progress, events) {
    return {
      performance: this.analyzePerformance(sessions),
      learning: this.analyzeLearning(sessions, progress),
      engagement: this.analyzeEngagement(sessions, progress),
      helpSeeking: this.analyzeHelpSeeking(events),
      insights: this.generateInsights(sessions, progress, events),
      profileGeneratedAt: /* @__PURE__ */ new Date(),
      dataPointCount: sessions.length + events.length
    };
  }
  /**
   * Build a simplified UserProfile (for existing interface compatibility)
   */
  buildUserProfile(sessions, progress, events) {
    const behavioral = this.buildBehavioralProfile(sessions, progress, events);
    const nBackLevel = this.extractNBackLevel(progress.currentLevel);
    return {
      id: "user-profile",
      currentLevel: nBackLevel,
      totalSessions: progress.totalSessions,
      totalTrainingTime: progress.totalTime,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      preferences: {
        preferredTimeOfDay: behavioral.engagement.preferredTimeOfDay,
        averageSessionDuration: behavioral.engagement.averageSessionDuration,
        preferredMode: null,
        sessionsPerWeek: behavioral.engagement.averageSessionsPerWeek
      },
      trends: {
        overallTrend: behavioral.performance.accuracyTrend,
        positionTrend: behavioral.performance.accuracyTrend,
        audioTrend: behavioral.performance.accuracyTrend,
        recentAccuracies: sessions.slice(-10).map((s) => s.combinedAccuracy)
      },
      strengthsWeaknesses: {
        strongerModality: this.determineStrongerModality(
          behavioral.performance.positionStrength,
          behavioral.performance.audioStrength
        ),
        consistentlyStrugglesAt: null,
        consistentlyExcelsAt: null
      },
      behavioralPatterns: {
        respondsQuicklyToPosition: behavioral.performance.averageResponseTime < 1e3,
        respondsQuicklyToAudio: behavioral.performance.averageResponseTime < 1e3,
        tendsToPressMatchTooOften: this.checkFalseAlarmTendency(sessions),
        tendsToPressMatchTooRarely: this.checkMissTendency(sessions),
        performsBetterEarlyInSession: this.checkEarlyPerformance(sessions),
        performsBetterLateInSession: this.checkLatePerformance(sessions)
      },
      lastUpdated: /* @__PURE__ */ new Date()
    };
  }
  // ============================================================================
  // Performance Analysis
  // ============================================================================
  analyzePerformance(sessions) {
    if (sessions.length === 0) {
      return this.getDefaultPerformance();
    }
    const recentSessions = sessions.slice(-10);
    const accuracies = recentSessions.map((s) => s.combinedAccuracy);
    const avgAccuracy = this.average(accuracies);
    const accuracyTrend = this.calculateTrend(accuracies);
    const responseTimes = this.extractResponseTimes(recentSessions);
    const avgResponseTime = this.average(responseTimes);
    const responseTimeTrend = this.calculateResponseTimeTrend(responseTimes);
    const positionAccuracies = recentSessions.map((s) => s.positionStats.accuracy);
    const audioAccuracies = recentSessions.map((s) => s.audioStats.accuracy);
    return {
      averageAccuracy: avgAccuracy,
      accuracyTrend,
      averageResponseTime: avgResponseTime,
      responseTimeTrend,
      positionStrength: this.average(positionAccuracies) / 100,
      audioStrength: this.average(audioAccuracies) / 100,
      commonErrorPatterns: this.findErrorPatterns(recentSessions),
      fatigueIndicators: this.detectFatigue(recentSessions)
    };
  }
  getDefaultPerformance() {
    return {
      averageAccuracy: 0,
      accuracyTrend: "stable",
      averageResponseTime: 0,
      responseTimeTrend: "stable",
      positionStrength: 0.5,
      audioStrength: 0.5,
      commonErrorPatterns: [],
      fatigueIndicators: []
    };
  }
  extractResponseTimes(sessions) {
    const times = [];
    for (const session of sessions) {
      for (const trial of session.trials) {
        if (trial.positionResponseTime !== null) {
          times.push(trial.positionResponseTime);
        }
        if (trial.audioResponseTime !== null) {
          times.push(trial.audioResponseTime);
        }
      }
    }
    return times;
  }
  findErrorPatterns(sessions) {
    const patterns = [];
    let positionMisses = 0;
    let audioMisses = 0;
    let positionFalseAlarms = 0;
    let audioFalseAlarms = 0;
    let totalTrials = 0;
    for (const session of sessions) {
      for (const trial of session.trials) {
        totalTrials++;
        if (trial.isPositionMatch && trial.userPositionResponse !== true) {
          positionMisses++;
        }
        if (trial.isAudioMatch && trial.userAudioResponse !== true) {
          audioMisses++;
        }
        if (!trial.isPositionMatch && trial.userPositionResponse === true) {
          positionFalseAlarms++;
        }
        if (!trial.isAudioMatch && trial.userAudioResponse === true) {
          audioFalseAlarms++;
        }
      }
    }
    if (totalTrials > 0) {
      const missThreshold = 0.15;
      const faThreshold = 0.1;
      if (positionMisses / totalTrials > missThreshold) {
        patterns.push({
          type: "position_miss",
          frequency: positionMisses / totalTrials,
          context: "Frequently missing position matches"
        });
      }
      if (audioMisses / totalTrials > missThreshold) {
        patterns.push({
          type: "audio_miss",
          frequency: audioMisses / totalTrials,
          context: "Frequently missing audio matches"
        });
      }
      if (positionFalseAlarms / totalTrials > faThreshold) {
        patterns.push({
          type: "position_false_alarm",
          frequency: positionFalseAlarms / totalTrials,
          context: "Frequent false alarms on position"
        });
      }
      if (audioFalseAlarms / totalTrials > faThreshold) {
        patterns.push({
          type: "audio_false_alarm",
          frequency: audioFalseAlarms / totalTrials,
          context: "Frequent false alarms on audio"
        });
      }
    }
    return patterns;
  }
  detectFatigue(sessions) {
    const indicators = [];
    for (const session of sessions) {
      const trials = session.trials;
      if (trials.length < 10) continue;
      const firstHalf = trials.slice(0, Math.floor(trials.length / 2));
      const secondHalf = trials.slice(Math.floor(trials.length / 2));
      const firstHalfCorrect = this.calculateTrialAccuracy(firstHalf);
      const secondHalfCorrect = this.calculateTrialAccuracy(secondHalf);
      if (firstHalfCorrect - secondHalfCorrect > 15) {
        indicators.push({
          type: "accuracy_drop",
          typicalOnset: Math.floor(trials.length / 2),
          severity: firstHalfCorrect - secondHalfCorrect > 25 ? "severe" : "moderate"
        });
      }
    }
    return indicators;
  }
  calculateTrialAccuracy(trials) {
    if (trials.length === 0) return 0;
    let correct = 0;
    let total = 0;
    for (const trial of trials) {
      if (trial.userPositionResponse !== null || trial.isPositionMatch) {
        total++;
        if (trial.userPositionResponse === trial.isPositionMatch) {
          correct++;
        }
      }
      if (trial.userAudioResponse !== null || trial.isAudioMatch) {
        total++;
        if (trial.userAudioResponse === trial.isAudioMatch) {
          correct++;
        }
      }
    }
    return total > 0 ? correct / total * 100 : 0;
  }
  // ============================================================================
  // Learning Analysis
  // ============================================================================
  analyzeLearning(sessions, progress) {
    const levelHistory = this.getLevelHistory(sessions);
    const progressionRate = this.calculateProgressionRate(sessions, progress);
    const plateauInfo = this.detectPlateau(sessions);
    return {
      currentLevel: progress.currentLevel,
      progressionRate,
      levelsCompleted: Math.max(0, progress.unlockedLevels.length - 2),
      averageAttemptsPerLevel: this.calculateAverageAttempts(levelHistory),
      plateauDetected: plateauInfo.detected,
      plateauDuration: plateauInfo.duration,
      recommendedNextLevel: this.recommendNextLevel(sessions, progress)
    };
  }
  getLevelHistory(sessions) {
    const history = /* @__PURE__ */ new Map();
    for (const session of sessions) {
      const count = history.get(session.levelId) ?? 0;
      history.set(session.levelId, count + 1);
    }
    return history;
  }
  calculateProgressionRate(sessions, progress) {
    if (sessions.length < 5) return "normal";
    const sessionsPerLevel = sessions.length / Math.max(1, progress.unlockedLevels.length);
    if (sessionsPerLevel < 3) return "fast";
    if (sessionsPerLevel > 8) return "slow";
    return "normal";
  }
  calculateAverageAttempts(levelHistory) {
    if (levelHistory.size === 0) return 0;
    const attempts = Array.from(levelHistory.values());
    return this.average(attempts);
  }
  detectPlateau(sessions) {
    if (sessions.length < 10) return { detected: false, duration: null };
    const recentAccuracies = sessions.slice(-10).map((s) => s.combinedAccuracy);
    const variance = this.calculateVariance(recentAccuracies);
    const average = this.average(recentAccuracies);
    if (variance < 5 && average < 80) {
      const firstSession = sessions[sessions.length - 10];
      const lastSession = sessions[sessions.length - 1];
      if (firstSession && lastSession) {
        const duration = Math.floor(
          (lastSession.timestamp.getTime() - firstSession.timestamp.getTime()) / (24 * 60 * 60 * 1e3)
        );
        return { detected: true, duration };
      }
    }
    return { detected: false, duration: null };
  }
  recommendNextLevel(sessions, progress) {
    if (sessions.length === 0) return null;
    const recentSessions = sessions.slice(-5);
    const avgAccuracy = this.average(recentSessions.map((s) => s.combinedAccuracy));
    if (avgAccuracy >= 80) {
      const currentLevel = progress.currentLevel;
      const nBack = this.extractNBackLevel(currentLevel);
      if (currentLevel.includes("position")) {
        return `position-${nBack + 1}`;
      } else if (currentLevel.includes("audio")) {
        return `audio-${nBack + 1}`;
      } else if (currentLevel.includes("dual")) {
        return `dual-${nBack + 1}`;
      }
    }
    return null;
  }
  // ============================================================================
  // Engagement Analysis
  // ============================================================================
  analyzeEngagement(sessions, progress) {
    const now = /* @__PURE__ */ new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const sessionsThisWeek = sessions.filter((s) => s.timestamp > weekAgo).length;
    const sessionDurations = sessions.map((s) => s.duration);
    const sessionHours = sessions.map((s) => s.timestamp.getHours());
    return {
      totalSessions: sessions.length,
      sessionsThisWeek,
      averageSessionsPerWeek: this.calculateWeeklyAverage(sessions),
      preferredTimeOfDay: this.detectPreferredTime(sessionHours),
      averageSessionDuration: this.average(sessionDurations),
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lastSessionDate: progress.lastSessionDate,
      daysSinceLastSession: progress.lastSessionDate ? Math.floor((now.getTime() - progress.lastSessionDate.getTime()) / (24 * 60 * 60 * 1e3)) : null
    };
  }
  calculateWeeklyAverage(sessions) {
    if (sessions.length === 0) return 0;
    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];
    if (!firstSession || !lastSession) return 0;
    const weeks = Math.max(
      1,
      (lastSession.timestamp.getTime() - firstSession.timestamp.getTime()) / (7 * 24 * 60 * 60 * 1e3)
    );
    return sessions.length / weeks;
  }
  detectPreferredTime(hours) {
    if (hours.length === 0) return null;
    const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    for (const hour of hours) {
      if (hour >= 5 && hour < 12) buckets.morning++;
      else if (hour >= 12 && hour < 17) buckets.afternoon++;
      else if (hour >= 17 && hour < 21) buckets.evening++;
      else buckets.night++;
    }
    const max = Math.max(buckets.morning, buckets.afternoon, buckets.evening, buckets.night);
    if (max === buckets.morning) return "morning";
    if (max === buckets.afternoon) return "afternoon";
    if (max === buckets.evening) return "evening";
    return "night";
  }
  // ============================================================================
  // Help-Seeking Analysis
  // ============================================================================
  analyzeHelpSeeking(events) {
    const helpEvents = events.filter((e) => e.category === "help");
    const popoverEvents = helpEvents.filter((e) => e.type === "HELP_VIEWED");
    return {
      popoverViewCount: popoverEvents.length,
      averagePopoverDuration: this.average(
        popoverEvents.map((e) => {
          const payload = e.payload;
          return typeof payload.duration === "number" ? payload.duration : 0;
        })
      ),
      tourCompleted: helpEvents.some((e) => e.type === "TOUR_COMPLETED"),
      frequentlyViewedHelp: this.findFrequentHelp(popoverEvents),
      helpViewTrend: this.calculateHelpTrend(popoverEvents)
    };
  }
  findFrequentHelp(events) {
    const helpIds = /* @__PURE__ */ new Map();
    for (const event of events) {
      const payload = event.payload;
      const helpId = typeof payload.helpId === "string" ? payload.helpId : "";
      if (helpId) {
        helpIds.set(helpId, (helpIds.get(helpId) ?? 0) + 1);
      }
    }
    return Array.from(helpIds.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
  }
  calculateHelpTrend(events) {
    if (events.length < 5) return "stable";
    const sorted = [...events].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    if (secondHalf.length > firstHalf.length * 1.5) return "increasing";
    if (secondHalf.length < firstHalf.length * 0.5) return "decreasing";
    return "stable";
  }
  // ============================================================================
  // Insights Generation
  // ============================================================================
  generateInsights(sessions, progress, events) {
    const strengths = [];
    const improvements = [];
    const motivational = [];
    const interventions = [];
    if (sessions.length > 0) {
      const recentSessions = sessions.slice(-10);
      const avgAccuracy = this.average(recentSessions.map((s) => s.combinedAccuracy));
      const positionAvg = this.average(recentSessions.map((s) => s.positionStats.accuracy));
      const audioAvg = this.average(recentSessions.map((s) => s.audioStats.accuracy));
      if (avgAccuracy >= 80) {
        strengths.push("Consistently high accuracy");
      }
      if (positionAvg > audioAvg + 10) {
        strengths.push("Strong spatial working memory");
        improvements.push("Practice audio-only tasks to balance skills");
      } else if (audioAvg > positionAvg + 10) {
        strengths.push("Strong auditory working memory");
        improvements.push("Practice position-only tasks to balance skills");
      }
      if (progress.currentStreak >= 7) {
        motivational.push("Amazing consistency! Your streak shows dedication.");
      }
      if (avgAccuracy < 60) {
        improvements.push("Consider practicing at a lower n-back level");
        interventions.push("Offer to reduce difficulty");
      }
    }
    if (progress.currentStreak === 0 && progress.totalSessions > 5) {
      interventions.push("Send reminder to maintain streak");
    }
    return {
      strengths,
      areasForImprovement: improvements,
      motivationalFactors: motivational,
      riskOfChurn: this.assessChurnRisk(sessions, progress),
      suggestedInterventions: interventions
    };
  }
  assessChurnRisk(sessions, progress) {
    if (progress.lastSessionDate === null) return "high";
    const daysSinceLastSession = Math.floor(
      (Date.now() - progress.lastSessionDate.getTime()) / (24 * 60 * 60 * 1e3)
    );
    if (daysSinceLastSession > 14) return "high";
    if (daysSinceLastSession > 7) return "medium";
    const recentSessions = sessions.slice(-5);
    if (recentSessions.length > 0) {
      const avgAccuracy = this.average(recentSessions.map((s) => s.combinedAccuracy));
      if (avgAccuracy < 50) return "medium";
    }
    return "low";
  }
  // ============================================================================
  // Helper Methods
  // ============================================================================
  average(nums) {
    if (nums.length === 0) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }
  calculateVariance(nums) {
    if (nums.length === 0) return 0;
    const avg = this.average(nums);
    const squaredDiffs = nums.map((n) => Math.pow(n - avg, 2));
    return this.average(squaredDiffs);
  }
  calculateTrend(values) {
    if (values.length < 3) return "stable";
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = this.average(firstHalf);
    const secondAvg = this.average(secondHalf);
    const diff = secondAvg - firstAvg;
    if (diff > 5) return "improving";
    if (diff < -5) return "declining";
    return "stable";
  }
  calculateResponseTimeTrend(values) {
    const trend = this.calculateTrend(values);
    if (trend === "declining") return "faster";
    if (trend === "improving") return "slower";
    return "stable";
  }
  extractNBackLevel(levelId) {
    const match = levelId.match(/(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 9) return num;
    }
    return 1;
  }
  determineStrongerModality(positionStrength, audioStrength) {
    const diff = positionStrength - audioStrength;
    if (diff > 0.1) return "position";
    if (diff < -0.1) return "audio";
    return "balanced";
  }
  checkFalseAlarmTendency(sessions) {
    if (sessions.length === 0) return false;
    const recentSessions = sessions.slice(-5);
    const avgFalseAlarmRate = this.average(
      recentSessions.map(
        (s) => (s.positionStats.falseAlarmRate + s.audioStats.falseAlarmRate) / 2
      )
    );
    return avgFalseAlarmRate > 0.3;
  }
  checkMissTendency(sessions) {
    if (sessions.length === 0) return false;
    const recentSessions = sessions.slice(-5);
    const avgMissRate = this.average(
      recentSessions.map((s) => {
        const positionMissRate = 1 - s.positionStats.hitRate;
        const audioMissRate = 1 - s.audioStats.hitRate;
        return (positionMissRate + audioMissRate) / 2;
      })
    );
    return avgMissRate > 0.3;
  }
  checkEarlyPerformance(sessions) {
    let earlyBetter = 0;
    let lateBetter = 0;
    for (const session of sessions.slice(-5)) {
      const trials = session.trials;
      if (trials.length < 10) continue;
      const firstHalf = trials.slice(0, Math.floor(trials.length / 2));
      const secondHalf = trials.slice(Math.floor(trials.length / 2));
      const firstAcc = this.calculateTrialAccuracy(firstHalf);
      const secondAcc = this.calculateTrialAccuracy(secondHalf);
      if (firstAcc > secondAcc + 5) earlyBetter++;
      else if (secondAcc > firstAcc + 5) lateBetter++;
    }
    return earlyBetter > lateBetter;
  }
  checkLatePerformance(sessions) {
    let earlyBetter = 0;
    let lateBetter = 0;
    for (const session of sessions.slice(-5)) {
      const trials = session.trials;
      if (trials.length < 10) continue;
      const firstHalf = trials.slice(0, Math.floor(trials.length / 2));
      const secondHalf = trials.slice(Math.floor(trials.length / 2));
      const firstAcc = this.calculateTrialAccuracy(firstHalf);
      const secondAcc = this.calculateTrialAccuracy(secondHalf);
      if (firstAcc > secondAcc + 5) earlyBetter++;
      else if (secondAcc > firstAcc + 5) lateBetter++;
    }
    return lateBetter > earlyBetter;
  }
};
function createProfileAnalyzer() {
  return new ProfileAnalyzer();
}

exports.ProfileAnalyzer = ProfileAnalyzer;
exports.ScoringService = ScoringService;
exports.SequenceGenerator = SequenceGenerator;
exports.createProfileAnalyzer = createProfileAnalyzer;
exports.createScoringService = createScoringService;
exports.createSequenceGenerator = createSequenceGenerator;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map