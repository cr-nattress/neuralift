/**
 * Session Entity
 *
 * Represents a complete training session consisting of multiple trials.
 * Mutates internally for performance during gameplay.
 */

import type { NBackLevel } from '../value-objects/NBackLevel';
import type { TrainingMode } from '../value-objects/TrainingMode';
import {
  type PerformanceStats,
  type PerformanceRawCounts,
  createPerformanceStats,
  createEmptyPerformanceStats,
} from '../value-objects/PerformanceStats';
import { modeIncludesPosition, modeIncludesAudio } from '../value-objects/TrainingMode';
import { Trial, type TrialData } from './Trial';

/**
 * Configuration for creating a session
 */
export interface SessionConfig {
  readonly levelId: string;
  readonly nBack: NBackLevel;
  readonly mode: TrainingMode;
  readonly trialCount: number;
  readonly trialDuration: number;
}

/**
 * Result of a completed session
 */
export interface SessionResult {
  readonly sessionId: string;
  readonly levelId: string;
  readonly mode: TrainingMode;
  readonly nBack: NBackLevel;
  readonly timestamp: Date;
  readonly duration: number;
  readonly trials: TrialData[];
  readonly positionStats: PerformanceStats;
  readonly audioStats: PerformanceStats;
  readonly combinedAccuracy: number;
  readonly completed: boolean;
}

/**
 * Session progress information
 */
export interface SessionProgress {
  readonly current: number;
  readonly total: number;
  readonly percentage: number;
}

/**
 * Session entity - manages training session state
 */
export class Session {
  private readonly sessionId: string;
  private readonly config: SessionConfig;
  private trials: Trial[];
  private currentTrialIndex: number;
  private startTime: number | null;
  private endTime: number | null;
  private isCompleted: boolean;

  constructor(sessionId: string, config: SessionConfig, trials: Trial[]) {
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
  start(): void {
    this.startTime = Date.now();
  }

  /**
   * Gets the session ID
   */
  getId(): string {
    return this.sessionId;
  }

  /**
   * Gets the session configuration
   */
  getConfig(): SessionConfig {
    return this.config;
  }

  /**
   * Gets the current trial, or null if session is complete
   */
  getCurrentTrial(): Trial | null {
    if (this.currentTrialIndex >= this.trials.length) {
      return null;
    }
    const trial = this.trials[this.currentTrialIndex];
    return trial ?? null;
  }

  /**
   * Gets the current trial index
   */
  getCurrentTrialIndex(): number {
    return this.currentTrialIndex;
  }

  /**
   * Records a position response for the current trial
   */
  recordPositionResponse(response: boolean): void {
    const currentTrial = this.trials[this.currentTrialIndex];
    if (!currentTrial) return;
    this.trials[this.currentTrialIndex] = currentTrial.recordPositionResponse(response);
  }

  /**
   * Records an audio response for the current trial
   */
  recordAudioResponse(response: boolean): void {
    const currentTrial = this.trials[this.currentTrialIndex];
    if (!currentTrial) return;
    this.trials[this.currentTrialIndex] = currentTrial.recordAudioResponse(response);
  }

  /**
   * Advances to the next trial
   * @returns true if there are more trials, false if session is complete
   */
  advanceToNextTrial(): boolean {
    this.currentTrialIndex++;
    return this.currentTrialIndex < this.trials.length;
  }

  /**
   * Completes the session and returns results
   */
  complete(): SessionResult {
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
      completed: true,
    };
  }

  /**
   * Gets session progress
   */
  getProgress(): SessionProgress {
    const current = this.currentTrialIndex + 1;
    const total = this.trials.length;
    const percentage = total > 0 ? (this.currentTrialIndex / total) * 100 : 0;

    return { current, total, percentage };
  }

  /**
   * Checks if the session is complete
   */
  isSessionComplete(): boolean {
    return this.isCompleted || this.currentTrialIndex >= this.trials.length;
  }

  /**
   * Gets all trials
   */
  getTrials(): readonly Trial[] {
    return this.trials;
  }

  private calculatePositionStats(): PerformanceStats {
    if (!modeIncludesPosition(this.config.mode)) {
      return createEmptyPerformanceStats();
    }

    const counts: PerformanceRawCounts = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejections: 0,
      responseTimes: [],
    };

    for (const trial of this.trials) {
      const category = trial.getPositionCategory();
      switch (category) {
        case 'hit':
          counts.hits++;
          break;
        case 'miss':
          counts.misses++;
          break;
        case 'falseAlarm':
          counts.falseAlarms++;
          break;
        case 'correctRejection':
          counts.correctRejections++;
          break;
      }

      if (trial.positionResponseTime !== null) {
        counts.responseTimes.push(trial.positionResponseTime);
      }
    }

    return createPerformanceStats(counts);
  }

  private calculateAudioStats(): PerformanceStats {
    if (!modeIncludesAudio(this.config.mode)) {
      return createEmptyPerformanceStats();
    }

    const counts: PerformanceRawCounts = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejections: 0,
      responseTimes: [],
    };

    for (const trial of this.trials) {
      const category = trial.getAudioCategory();
      switch (category) {
        case 'hit':
          counts.hits++;
          break;
        case 'miss':
          counts.misses++;
          break;
        case 'falseAlarm':
          counts.falseAlarms++;
          break;
        case 'correctRejection':
          counts.correctRejections++;
          break;
      }

      if (trial.audioResponseTime !== null) {
        counts.responseTimes.push(trial.audioResponseTime);
      }
    }

    return createPerformanceStats(counts);
  }

  private calculateCombinedAccuracy(
    positionStats: PerformanceStats,
    audioStats: PerformanceStats
  ): number {
    const mode = this.config.mode;

    if (mode === 'single-position') {
      return positionStats.accuracy;
    }
    if (mode === 'single-audio') {
      return audioStats.accuracy;
    }

    // Dual mode - average of both
    return (positionStats.accuracy + audioStats.accuracy) / 2;
  }

  /**
   * Serializes session to result format
   */
  toJSON(): SessionResult {
    const positionStats = this.calculatePositionStats();
    const audioStats = this.calculateAudioStats();
    const combinedAccuracy = this.calculateCombinedAccuracy(positionStats, audioStats);
    const duration = this.startTime
      ? (this.endTime ?? Date.now()) - this.startTime
      : 0;

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
      completed: this.isCompleted,
    };
  }
}
