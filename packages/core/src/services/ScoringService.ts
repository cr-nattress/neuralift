/**
 * ScoringService
 *
 * Calculates performance metrics including accuracy and d-prime scores.
 * Uses signal detection theory for cognitive assessment.
 */

import type { TrainingMode } from '../domain/value-objects/TrainingMode';
import type { PerformanceStats, PerformanceRawCounts } from '../domain/value-objects/PerformanceStats';
import { createPerformanceStats, createEmptyPerformanceStats } from '../domain/value-objects/PerformanceStats';

/**
 * Represents a single trial result for scoring
 */
export interface TrialResult {
  /** Whether this trial was a match (signal) */
  isMatch: boolean;
  /** Whether the user responded (claimed match) */
  userResponse: boolean | null;
  /** Response time in milliseconds (null if no response) */
  responseTime: number | null;
}

/**
 * Dual trial result for position and audio
 */
export interface DualTrialResult {
  position: TrialResult;
  audio: TrialResult;
}

/**
 * Combined session result with separate position/audio stats
 */
export interface SessionScoringResult {
  /** Position performance stats */
  positionStats: PerformanceStats;
  /** Audio performance stats */
  audioStats: PerformanceStats;
  /** Combined accuracy (mode-dependent weighting) */
  combinedAccuracy: number;
  /** Combined d-prime */
  combinedDPrime: number;
}

/**
 * ScoringService
 *
 * Provides methods for calculating performance statistics from trial results.
 * Handles edge cases and uses signal detection theory metrics.
 */
export class ScoringService {
  /**
   * Calculate performance statistics from a set of trial results
   */
  calculateStats(trials: TrialResult[]): PerformanceStats {
    if (trials.length === 0) {
      return createEmptyPerformanceStats();
    }

    const counts: PerformanceRawCounts = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejections: 0,
      responseTimes: [],
    };

    for (const trial of trials) {
      const userResponded = trial.userResponse === true;

      if (trial.isMatch) {
        // Signal trial
        if (userResponded) {
          counts.hits++;
        } else {
          counts.misses++;
        }
      } else {
        // Noise trial
        if (userResponded) {
          counts.falseAlarms++;
        } else {
          counts.correctRejections++;
        }
      }

      // Collect response times
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
  calculateStatsWithCorrection(trials: TrialResult[]): PerformanceStats {
    if (trials.length === 0) {
      return createEmptyPerformanceStats();
    }

    let hits = 0;
    let misses = 0;
    let falseAlarms = 0;
    let correctRejections = 0;
    const responseTimes: number[] = [];

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

    // Apply log-linear correction: (count + 0.5) / (total + 1)
    const hitRate = totalSignals > 0 ? (hits + 0.5) / (totalSignals + 1) : 0.5;
    const falseAlarmRate = totalNoise > 0 ? (falseAlarms + 0.5) / (totalNoise + 1) : 0.5;

    // Calculate d-prime with corrected rates
    const dPrime = this.calculateDPrime(hitRate, falseAlarmRate);

    // Calculate accuracy (no correction needed)
    const correctResponses = hits + correctRejections;
    const accuracy = total > 0 ? (correctResponses / total) * 100 : 0;

    // Calculate average response time
    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
        : null;

    return {
      hits,
      misses,
      falseAlarms,
      correctRejections,
      hitRate,
      falseAlarmRate,
      dPrime,
      accuracy,
      avgResponseTime,
    };
  }

  /**
   * Calculate d-prime using inverse normal CDF
   * d' = Z(hitRate) - Z(falseAlarmRate)
   */
  calculateDPrime(hitRate: number, falseAlarmRate: number): number {
    // Clamp rates to avoid infinity
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
  private inverseNormalCDF(p: number): number {
    // Coefficients for rational approximation
    const a = [
      -3.969683028665376e1,
      2.209460984245205e2,
      -2.759285104469687e2,
      1.383577518672690e2,
      -3.066479806614716e1,
      2.506628277459239e0,
    ];
    const b = [
      -5.447609879822406e1,
      1.615858368580409e2,
      -1.556989798598866e2,
      6.680131188771972e1,
      -1.328068155288572e1,
    ];
    const c = [
      -7.784894002430293e-3,
      -3.223964580411365e-1,
      -2.400758277161838e0,
      -2.549732539343734e0,
      4.374664141464968e0,
      2.938163982698783e0,
    ];
    const d = [
      7.784695709041462e-3,
      3.224671290700398e-1,
      2.445134137142996e0,
      3.754408661907416e0,
    ];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number;
    let r: number;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (
        (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
        ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
      );
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (
        ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
        (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
      );
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return (
        -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
        ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
      );
    }
  }

  /**
   * Calculate full session result from position and audio trials
   */
  calculateSessionResult(
    positionTrials: TrialResult[],
    audioTrials: TrialResult[],
    mode: TrainingMode
  ): SessionScoringResult {
    const positionStats = this.calculateStatsWithCorrection(positionTrials);
    const audioStats = this.calculateStatsWithCorrection(audioTrials);

    let combinedAccuracy: number;
    let combinedDPrime: number;

    switch (mode) {
      case 'single-position':
        combinedAccuracy = positionStats.accuracy;
        combinedDPrime = positionStats.dPrime;
        break;
      case 'single-audio':
        combinedAccuracy = audioStats.accuracy;
        combinedDPrime = audioStats.dPrime;
        break;
      case 'dual':
        // Average of both for dual mode
        combinedAccuracy = (positionStats.accuracy + audioStats.accuracy) / 2;
        combinedDPrime = (positionStats.dPrime + audioStats.dPrime) / 2;
        break;
    }

    return {
      positionStats,
      audioStats,
      combinedAccuracy,
      combinedDPrime,
    };
  }

  /**
   * Calculate session result from dual trial results
   */
  calculateDualSessionResult(
    trials: DualTrialResult[],
    mode: TrainingMode
  ): SessionScoringResult {
    const positionTrials = trials.map((t) => t.position);
    const audioTrials = trials.map((t) => t.audio);

    return this.calculateSessionResult(positionTrials, audioTrials, mode);
  }

  /**
   * Determine performance level based on d-prime
   * Used for progression decisions
   */
  getPerformanceLevel(dPrime: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (dPrime < 1) return 'poor';
    if (dPrime < 2) return 'fair';
    if (dPrime < 3) return 'good';
    return 'excellent';
  }

  /**
   * Check if performance meets advancement criteria
   * Default threshold is d-prime >= 2.0
   */
  meetsAdvancementCriteria(dPrime: number, threshold = 2.0): boolean {
    return dPrime >= threshold;
  }
}

/**
 * Factory function to create a ScoringService instance
 */
export function createScoringService(): ScoringService {
  return new ScoringService();
}
