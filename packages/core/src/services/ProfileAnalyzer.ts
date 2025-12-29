/**
 * ProfileAnalyzer Service
 *
 * Analyzes user behavior patterns across sessions.
 * Builds user profiles for personalized feedback and LLM recommendations.
 */

import type { SessionResult } from '../domain/entities/Session';
import type { UserProgress } from '../ports/IProgressRepository';
import type { AnalyticsEvent } from '../ports/IAnalyticsRepository';
import type { UserProfile } from '../domain/entities/UserProfile';

/**
 * Error pattern identified in user behavior
 */
export interface ErrorPattern {
  type: 'position_miss' | 'audio_miss' | 'position_false_alarm' | 'audio_false_alarm';
  frequency: number;
  context: string;
}

/**
 * Fatigue indicator detected in session performance
 */
export interface FatigueIndicator {
  type: 'accuracy_drop' | 'response_slowdown' | 'error_spike';
  typicalOnset: number;
  severity: 'mild' | 'moderate' | 'severe';
}

/**
 * Comprehensive behavioral profile for LLM consumption
 */
export interface UserBehavioralProfile {
  performance: {
    averageAccuracy: number;
    accuracyTrend: 'improving' | 'stable' | 'declining';
    averageResponseTime: number;
    responseTimeTrend: 'faster' | 'stable' | 'slower';
    positionStrength: number;
    audioStrength: number;
    commonErrorPatterns: ErrorPattern[];
    fatigueIndicators: FatigueIndicator[];
  };

  learning: {
    currentLevel: string;
    progressionRate: 'fast' | 'normal' | 'slow';
    levelsCompleted: number;
    averageAttemptsPerLevel: number;
    plateauDetected: boolean;
    plateauDuration: number | null;
    recommendedNextLevel: string | null;
  };

  engagement: {
    totalSessions: number;
    sessionsThisWeek: number;
    averageSessionsPerWeek: number;
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | null;
    averageSessionDuration: number;
    currentStreak: number;
    longestStreak: number;
    lastSessionDate: Date | null;
    daysSinceLastSession: number | null;
  };

  helpSeeking: {
    popoverViewCount: number;
    averagePopoverDuration: number;
    tourCompleted: boolean;
    frequentlyViewedHelp: string[];
    helpViewTrend: 'increasing' | 'stable' | 'decreasing';
  };

  insights: {
    strengths: string[];
    areasForImprovement: string[];
    motivationalFactors: string[];
    riskOfChurn: 'low' | 'medium' | 'high';
    suggestedInterventions: string[];
  };

  profileGeneratedAt: Date;
  dataPointCount: number;
}

/**
 * ProfileAnalyzer Service
 *
 * Builds comprehensive user behavioral profiles from session and analytics data.
 */
export class ProfileAnalyzer {
  /**
   * Build a comprehensive behavioral profile
   */
  buildBehavioralProfile(
    sessions: SessionResult[],
    progress: UserProgress,
    events: AnalyticsEvent[]
  ): UserBehavioralProfile {
    return {
      performance: this.analyzePerformance(sessions),
      learning: this.analyzeLearning(sessions, progress),
      engagement: this.analyzeEngagement(sessions, progress),
      helpSeeking: this.analyzeHelpSeeking(events),
      insights: this.generateInsights(sessions, progress, events),
      profileGeneratedAt: new Date(),
      dataPointCount: sessions.length + events.length,
    };
  }

  /**
   * Build a simplified UserProfile (for existing interface compatibility)
   */
  buildUserProfile(
    sessions: SessionResult[],
    progress: UserProgress,
    events: AnalyticsEvent[]
  ): UserProfile {
    const behavioral = this.buildBehavioralProfile(sessions, progress, events);
    const nBackLevel = this.extractNBackLevel(progress.currentLevel);

    return {
      id: 'user-profile',
      currentLevel: nBackLevel,
      totalSessions: progress.totalSessions,
      totalTrainingTime: progress.totalTime,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      preferences: {
        preferredTimeOfDay: behavioral.engagement.preferredTimeOfDay,
        averageSessionDuration: behavioral.engagement.averageSessionDuration,
        preferredMode: null,
        sessionsPerWeek: behavioral.engagement.averageSessionsPerWeek,
      },
      trends: {
        overallTrend: behavioral.performance.accuracyTrend,
        positionTrend: behavioral.performance.accuracyTrend,
        audioTrend: behavioral.performance.accuracyTrend,
        recentAccuracies: sessions.slice(-10).map((s) => s.combinedAccuracy),
      },
      strengthsWeaknesses: {
        strongerModality: this.determineStrongerModality(
          behavioral.performance.positionStrength,
          behavioral.performance.audioStrength
        ),
        consistentlyStrugglesAt: null,
        consistentlyExcelsAt: null,
      },
      behavioralPatterns: {
        respondsQuicklyToPosition: behavioral.performance.averageResponseTime < 1000,
        respondsQuicklyToAudio: behavioral.performance.averageResponseTime < 1000,
        tendsToPressMatchTooOften: this.checkFalseAlarmTendency(sessions),
        tendsToPressMatchTooRarely: this.checkMissTendency(sessions),
        performsBetterEarlyInSession: this.checkEarlyPerformance(sessions),
        performsBetterLateInSession: this.checkLatePerformance(sessions),
      },
      lastUpdated: new Date(),
    };
  }

  // ============================================================================
  // Performance Analysis
  // ============================================================================

  private analyzePerformance(sessions: SessionResult[]) {
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
      fatigueIndicators: this.detectFatigue(recentSessions),
    };
  }

  private getDefaultPerformance() {
    return {
      averageAccuracy: 0,
      accuracyTrend: 'stable' as const,
      averageResponseTime: 0,
      responseTimeTrend: 'stable' as const,
      positionStrength: 0.5,
      audioStrength: 0.5,
      commonErrorPatterns: [],
      fatigueIndicators: [],
    };
  }

  private extractResponseTimes(sessions: SessionResult[]): number[] {
    const times: number[] = [];
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

  private findErrorPatterns(sessions: SessionResult[]): ErrorPattern[] {
    const patterns: ErrorPattern[] = [];
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
          type: 'position_miss',
          frequency: positionMisses / totalTrials,
          context: 'Frequently missing position matches',
        });
      }
      if (audioMisses / totalTrials > missThreshold) {
        patterns.push({
          type: 'audio_miss',
          frequency: audioMisses / totalTrials,
          context: 'Frequently missing audio matches',
        });
      }
      if (positionFalseAlarms / totalTrials > faThreshold) {
        patterns.push({
          type: 'position_false_alarm',
          frequency: positionFalseAlarms / totalTrials,
          context: 'Frequent false alarms on position',
        });
      }
      if (audioFalseAlarms / totalTrials > faThreshold) {
        patterns.push({
          type: 'audio_false_alarm',
          frequency: audioFalseAlarms / totalTrials,
          context: 'Frequent false alarms on audio',
        });
      }
    }

    return patterns;
  }

  private detectFatigue(sessions: SessionResult[]): FatigueIndicator[] {
    const indicators: FatigueIndicator[] = [];

    for (const session of sessions) {
      const trials = session.trials;
      if (trials.length < 10) continue;

      const firstHalf = trials.slice(0, Math.floor(trials.length / 2));
      const secondHalf = trials.slice(Math.floor(trials.length / 2));

      const firstHalfCorrect = this.calculateTrialAccuracy(firstHalf);
      const secondHalfCorrect = this.calculateTrialAccuracy(secondHalf);

      if (firstHalfCorrect - secondHalfCorrect > 15) {
        indicators.push({
          type: 'accuracy_drop',
          typicalOnset: Math.floor(trials.length / 2),
          severity: firstHalfCorrect - secondHalfCorrect > 25 ? 'severe' : 'moderate',
        });
      }
    }

    return indicators;
  }

  private calculateTrialAccuracy(trials: SessionResult['trials']): number {
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

    return total > 0 ? (correct / total) * 100 : 0;
  }

  // ============================================================================
  // Learning Analysis
  // ============================================================================

  private analyzeLearning(sessions: SessionResult[], progress: UserProgress) {
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
      recommendedNextLevel: this.recommendNextLevel(sessions, progress),
    };
  }

  private getLevelHistory(sessions: SessionResult[]): Map<string, number> {
    const history = new Map<string, number>();
    for (const session of sessions) {
      const count = history.get(session.levelId) ?? 0;
      history.set(session.levelId, count + 1);
    }
    return history;
  }

  private calculateProgressionRate(
    sessions: SessionResult[],
    progress: UserProgress
  ): 'fast' | 'normal' | 'slow' {
    if (sessions.length < 5) return 'normal';

    const sessionsPerLevel = sessions.length / Math.max(1, progress.unlockedLevels.length);

    if (sessionsPerLevel < 3) return 'fast';
    if (sessionsPerLevel > 8) return 'slow';
    return 'normal';
  }

  private calculateAverageAttempts(levelHistory: Map<string, number>): number {
    if (levelHistory.size === 0) return 0;
    const attempts = Array.from(levelHistory.values());
    return this.average(attempts);
  }

  private detectPlateau(sessions: SessionResult[]): { detected: boolean; duration: number | null } {
    if (sessions.length < 10) return { detected: false, duration: null };

    const recentAccuracies = sessions.slice(-10).map((s) => s.combinedAccuracy);
    const variance = this.calculateVariance(recentAccuracies);
    const average = this.average(recentAccuracies);

    if (variance < 5 && average < 80) {
      const firstSession = sessions[sessions.length - 10];
      const lastSession = sessions[sessions.length - 1];
      if (firstSession && lastSession) {
        const duration = Math.floor(
          (lastSession.timestamp.getTime() - firstSession.timestamp.getTime()) /
            (24 * 60 * 60 * 1000)
        );
        return { detected: true, duration };
      }
    }

    return { detected: false, duration: null };
  }

  private recommendNextLevel(sessions: SessionResult[], progress: UserProgress): string | null {
    if (sessions.length === 0) return null;

    const recentSessions = sessions.slice(-5);
    const avgAccuracy = this.average(recentSessions.map((s) => s.combinedAccuracy));

    if (avgAccuracy >= 80) {
      const currentLevel = progress.currentLevel;
      const nBack = this.extractNBackLevel(currentLevel);

      if (currentLevel.includes('position')) {
        return `position-${nBack + 1}`;
      } else if (currentLevel.includes('audio')) {
        return `audio-${nBack + 1}`;
      } else if (currentLevel.includes('dual')) {
        return `dual-${nBack + 1}`;
      }
    }

    return null;
  }

  // ============================================================================
  // Engagement Analysis
  // ============================================================================

  private analyzeEngagement(sessions: SessionResult[], progress: UserProgress) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
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
      daysSinceLastSession: progress.lastSessionDate
        ? Math.floor((now.getTime() - progress.lastSessionDate.getTime()) / (24 * 60 * 60 * 1000))
        : null,
    };
  }

  private calculateWeeklyAverage(sessions: SessionResult[]): number {
    if (sessions.length === 0) return 0;

    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];

    if (!firstSession || !lastSession) return 0;

    const weeks = Math.max(
      1,
      (lastSession.timestamp.getTime() - firstSession.timestamp.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );

    return sessions.length / weeks;
  }

  private detectPreferredTime(hours: number[]): 'morning' | 'afternoon' | 'evening' | 'night' | null {
    if (hours.length === 0) return null;

    const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    for (const hour of hours) {
      if (hour >= 5 && hour < 12) buckets.morning++;
      else if (hour >= 12 && hour < 17) buckets.afternoon++;
      else if (hour >= 17 && hour < 21) buckets.evening++;
      else buckets.night++;
    }

    const max = Math.max(buckets.morning, buckets.afternoon, buckets.evening, buckets.night);

    if (max === buckets.morning) return 'morning';
    if (max === buckets.afternoon) return 'afternoon';
    if (max === buckets.evening) return 'evening';
    return 'night';
  }

  // ============================================================================
  // Help-Seeking Analysis
  // ============================================================================

  private analyzeHelpSeeking(events: AnalyticsEvent[]) {
    const helpEvents = events.filter((e) => e.category === 'help');
    const popoverEvents = helpEvents.filter((e) => e.type === 'HELP_VIEWED');

    return {
      popoverViewCount: popoverEvents.length,
      averagePopoverDuration: this.average(
        popoverEvents.map((e) => {
          const payload = e.payload as Record<string, unknown>;
          return typeof payload.duration === 'number' ? payload.duration : 0;
        })
      ),
      tourCompleted: helpEvents.some((e) => e.type === 'TOUR_COMPLETED'),
      frequentlyViewedHelp: this.findFrequentHelp(popoverEvents),
      helpViewTrend: this.calculateHelpTrend(popoverEvents),
    };
  }

  private findFrequentHelp(events: AnalyticsEvent[]): string[] {
    const helpIds = new Map<string, number>();

    for (const event of events) {
      const payload = event.payload as Record<string, unknown>;
      const helpId = typeof payload.helpId === 'string' ? payload.helpId : '';
      if (helpId) {
        helpIds.set(helpId, (helpIds.get(helpId) ?? 0) + 1);
      }
    }

    return Array.from(helpIds.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);
  }

  private calculateHelpTrend(events: AnalyticsEvent[]): 'increasing' | 'stable' | 'decreasing' {
    if (events.length < 5) return 'stable';

    const sorted = [...events].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    if (secondHalf.length > firstHalf.length * 1.5) return 'increasing';
    if (secondHalf.length < firstHalf.length * 0.5) return 'decreasing';
    return 'stable';
  }

  // ============================================================================
  // Insights Generation
  // ============================================================================

  private generateInsights(
    sessions: SessionResult[],
    progress: UserProgress,
    events: AnalyticsEvent[]
  ) {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const motivational: string[] = [];
    const interventions: string[] = [];

    if (sessions.length > 0) {
      const recentSessions = sessions.slice(-10);
      const avgAccuracy = this.average(recentSessions.map((s) => s.combinedAccuracy));
      const positionAvg = this.average(recentSessions.map((s) => s.positionStats.accuracy));
      const audioAvg = this.average(recentSessions.map((s) => s.audioStats.accuracy));

      if (avgAccuracy >= 80) {
        strengths.push('Consistently high accuracy');
      }
      if (positionAvg > audioAvg + 10) {
        strengths.push('Strong spatial working memory');
        improvements.push('Practice audio-only tasks to balance skills');
      } else if (audioAvg > positionAvg + 10) {
        strengths.push('Strong auditory working memory');
        improvements.push('Practice position-only tasks to balance skills');
      }

      if (progress.currentStreak >= 7) {
        motivational.push('Amazing consistency! Your streak shows dedication.');
      }

      if (avgAccuracy < 60) {
        improvements.push('Consider practicing at a lower n-back level');
        interventions.push('Offer to reduce difficulty');
      }
    }

    if (progress.currentStreak === 0 && progress.totalSessions > 5) {
      interventions.push('Send reminder to maintain streak');
    }

    return {
      strengths,
      areasForImprovement: improvements,
      motivationalFactors: motivational,
      riskOfChurn: this.assessChurnRisk(sessions, progress),
      suggestedInterventions: interventions,
    };
  }

  private assessChurnRisk(
    sessions: SessionResult[],
    progress: UserProgress
  ): 'low' | 'medium' | 'high' {
    if (progress.lastSessionDate === null) return 'high';

    const daysSinceLastSession = Math.floor(
      (Date.now() - progress.lastSessionDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysSinceLastSession > 14) return 'high';
    if (daysSinceLastSession > 7) return 'medium';

    const recentSessions = sessions.slice(-5);
    if (recentSessions.length > 0) {
      const avgAccuracy = this.average(recentSessions.map((s) => s.combinedAccuracy));
      if (avgAccuracy < 50) return 'medium';
    }

    return 'low';
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private average(nums: number[]): number {
    if (nums.length === 0) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }

  private calculateVariance(nums: number[]): number {
    if (nums.length === 0) return 0;
    const avg = this.average(nums);
    const squaredDiffs = nums.map((n) => Math.pow(n - avg, 2));
    return this.average(squaredDiffs);
  }

  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 3) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = this.average(firstHalf);
    const secondAvg = this.average(secondHalf);

    const diff = secondAvg - firstAvg;

    if (diff > 5) return 'improving';
    if (diff < -5) return 'declining';
    return 'stable';
  }

  private calculateResponseTimeTrend(values: number[]): 'faster' | 'stable' | 'slower' {
    const trend = this.calculateTrend(values);
    if (trend === 'declining') return 'faster';
    if (trend === 'improving') return 'slower';
    return 'stable';
  }

  private extractNBackLevel(levelId: string): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
    const match = levelId.match(/(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 9) return num as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }
    return 1;
  }

  private determineStrongerModality(
    positionStrength: number,
    audioStrength: number
  ): 'position' | 'audio' | 'balanced' {
    const diff = positionStrength - audioStrength;
    if (diff > 0.1) return 'position';
    if (diff < -0.1) return 'audio';
    return 'balanced';
  }

  private checkFalseAlarmTendency(sessions: SessionResult[]): boolean {
    if (sessions.length === 0) return false;
    const recentSessions = sessions.slice(-5);
    const avgFalseAlarmRate = this.average(
      recentSessions.map(
        (s) => (s.positionStats.falseAlarmRate + s.audioStats.falseAlarmRate) / 2
      )
    );
    return avgFalseAlarmRate > 0.3;
  }

  private checkMissTendency(sessions: SessionResult[]): boolean {
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

  private checkEarlyPerformance(sessions: SessionResult[]): boolean {
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

  private checkLatePerformance(sessions: SessionResult[]): boolean {
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
}

/**
 * Factory function to create a ProfileAnalyzer instance
 */
export function createProfileAnalyzer(): ProfileAnalyzer {
  return new ProfileAnalyzer();
}
