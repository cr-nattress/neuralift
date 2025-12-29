/**
 * PerformanceStats Value Object
 *
 * Represents performance metrics for a session or trial set.
 * Uses signal detection theory metrics (d-prime) for cognitive assessment.
 */

/**
 * Performance statistics calculated from session trials
 */
export interface PerformanceStats {
  /** Number of correct match identifications (hits) */
  readonly hits: number;
  /** Number of missed matches (misses) */
  readonly misses: number;
  /** Number of incorrect match claims (false alarms) */
  readonly falseAlarms: number;
  /** Number of correctly identified non-matches */
  readonly correctRejections: number;
  /** Hit rate: hits / (hits + misses) */
  readonly hitRate: number;
  /** False alarm rate: falseAlarms / (falseAlarms + correctRejections) */
  readonly falseAlarmRate: number;
  /** D-prime: sensitivity measure from signal detection theory */
  readonly dPrime: number;
  /** Overall accuracy percentage (0-100) */
  readonly accuracy: number;
  /** Average response time in milliseconds (null if no responses) */
  readonly avgResponseTime: number | null;
}

/**
 * Raw counts for calculating performance stats
 */
export interface PerformanceRawCounts {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  responseTimes: number[];
}

/**
 * Calculates z-score for d-prime calculation
 * Uses approximation of inverse normal CDF
 */
function zScore(p: number): number {
  // Clamp to avoid infinity
  const clampedP = Math.max(0.001, Math.min(0.999, p));

  // Approximation using Abramowitz and Stegun formula
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

  const c1 = -7.78489400243029e-3;
  const c2 = -0.322396458041136;
  const c3 = -2.40075827716184;
  const c4 = -2.54973253934373;
  const c5 = 4.37466414146497;
  const c6 = 2.93816398269878;

  const d1 = 7.78469570904146e-3;
  const d2 = 0.32246712907004;
  const d3 = 2.445134137143;
  const d4 = 3.75440866190742;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;
  let r: number;

  if (clampedP < pLow) {
    q = Math.sqrt(-2 * Math.log(clampedP));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  } else if (clampedP <= pHigh) {
    q = clampedP - 0.5;
    r = q * q;
    return (
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - clampedP));
    return (
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }
}

/**
 * Creates PerformanceStats from raw counts
 */
export function createPerformanceStats(counts: PerformanceRawCounts): PerformanceStats {
  const { hits, misses, falseAlarms, correctRejections, responseTimes } = counts;

  const totalSignals = hits + misses;
  const totalNoise = falseAlarms + correctRejections;
  const total = totalSignals + totalNoise;

  // Calculate rates with edge case handling
  const hitRate = totalSignals > 0 ? hits / totalSignals : 0;
  const falseAlarmRate = totalNoise > 0 ? falseAlarms / totalNoise : 0;

  // Calculate d-prime
  const dPrime = zScore(hitRate) - zScore(falseAlarmRate);

  // Calculate accuracy
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
 * Creates empty performance stats (for initial state)
 */
export function createEmptyPerformanceStats(): PerformanceStats {
  return {
    hits: 0,
    misses: 0,
    falseAlarms: 0,
    correctRejections: 0,
    hitRate: 0,
    falseAlarmRate: 0,
    dPrime: 0,
    accuracy: 0,
    avgResponseTime: null,
  };
}
