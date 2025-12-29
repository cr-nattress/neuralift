# Story 03-002: Implement Scoring Service

## Story

**As a** developer
**I want** a scoring service
**So that** session performance is calculated accurately with d-prime

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Implement the ScoringService domain service that calculates hits, misses, false alarms, correct rejections, accuracy, and d-prime scores.

## Acceptance Criteria

- [ ] Calculate hit rate and false alarm rate
- [ ] Calculate d-prime using signal detection theory
- [ ] Handle edge cases (perfect scores, zero rates)
- [ ] Separate calculations for position and audio
- [ ] Calculate combined accuracy for dual mode

## Technical Details

### ScoringService

```typescript
// packages/core/src/services/ScoringService.ts

export interface TrialResult {
  isMatch: boolean;
  userResponse: boolean | null;
}

export class ScoringService {
  /**
   * Calculate performance statistics from trial results
   */
  calculateStats(trials: TrialResult[]): PerformanceStats {
    let hits = 0;           // Match + User responded
    let misses = 0;         // Match + User didn't respond
    let falseAlarms = 0;    // No match + User responded
    let correctRejections = 0; // No match + User didn't respond

    for (const trial of trials) {
      if (trial.isMatch) {
        if (trial.userResponse === true) {
          hits++;
        } else {
          misses++;
        }
      } else {
        if (trial.userResponse === true) {
          falseAlarms++;
        } else {
          correctRejections++;
        }
      }
    }

    const totalMatches = hits + misses;
    const totalNonMatches = falseAlarms + correctRejections;

    // Calculate rates (with correction for extreme values)
    const hitRate = this.calculateRate(hits, totalMatches);
    const falseAlarmRate = this.calculateRate(falseAlarms, totalNonMatches);

    // Calculate d-prime
    const dPrime = this.calculateDPrime(hitRate, falseAlarmRate);

    // Calculate overall accuracy
    const totalTrials = trials.length;
    const correct = hits + correctRejections;
    const accuracy = totalTrials > 0 ? correct / totalTrials : 0;

    return {
      hits,
      misses,
      falseAlarms,
      correctRejections,
      hitRate,
      falseAlarmRate,
      dPrime,
      accuracy,
    };
  }

  /**
   * Calculate rate with log-linear correction for extreme values
   * Prevents infinite d-prime when rate is 0 or 1
   */
  private calculateRate(count: number, total: number): number {
    if (total === 0) return 0.5; // No trials of this type

    // Log-linear correction: add 0.5 to counts
    // Formula: (count + 0.5) / (total + 1)
    return (count + 0.5) / (total + 1);
  }

  /**
   * Calculate d-prime using inverse normal CDF (probit function)
   */
  calculateDPrime(hitRate: number, falseAlarmRate: number): number {
    // Clamp rates to avoid infinity
    const clampedHR = Math.max(0.01, Math.min(0.99, hitRate));
    const clampedFAR = Math.max(0.01, Math.min(0.99, falseAlarmRate));

    // d' = Z(HR) - Z(FAR)
    const zHR = this.inverseNormalCDF(clampedHR);
    const zFAR = this.inverseNormalCDF(clampedFAR);

    return Number((zHR - zFAR).toFixed(2));
  }

  /**
   * Approximate inverse normal CDF (probit function)
   * Using Abramowitz and Stegun approximation
   */
  private inverseNormalCDF(p: number): number {
    // Rational approximation for lower region
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

    let q: number, r: number;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (
        (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
      );
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (
        ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
      );
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return (
        -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
      );
    }
  }

  /**
   * Calculate session result from position and audio stats
   */
  calculateSessionResult(
    positionTrials: TrialResult[],
    audioTrials: TrialResult[],
    mode: TrainingMode
  ): { positionStats: PerformanceStats; audioStats: PerformanceStats; combinedAccuracy: number } {
    const positionStats = this.calculateStats(positionTrials);
    const audioStats = this.calculateStats(audioTrials);

    let combinedAccuracy: number;
    if (mode === 'position-only') {
      combinedAccuracy = positionStats.accuracy;
    } else if (mode === 'audio-only') {
      combinedAccuracy = audioStats.accuracy;
    } else {
      combinedAccuracy = (positionStats.accuracy + audioStats.accuracy) / 2;
    }

    return { positionStats, audioStats, combinedAccuracy };
  }
}
```

## Tasks

- [ ] Create packages/core/src/services/ScoringService.ts
- [ ] Implement calculateStats()
- [ ] Implement calculateDPrime() with proper algorithm
- [ ] Add rate correction for extreme values
- [ ] Implement calculateSessionResult()
- [ ] Export from services/index.ts
- [ ] Write unit tests for various scenarios
- [ ] Test edge cases (all hits, all misses, etc.)

## Dependencies

- Story 01-006 (Domain Entities - PerformanceStats type)

## Notes

- Log-linear correction prevents infinite d-prime
- D-prime is the gold standard in cognitive psychology research
- Typical d-prime ranges: 0-1 (poor), 1-2 (fair), 2-3 (good), 3+ (excellent)
