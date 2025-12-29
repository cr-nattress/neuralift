# Story 03-010: Implement User Profile Builder

## Story

**As a** developer
**I want** a user profile builder service
**So that** comprehensive behavioral profiles power personalized recommendations

## Points: 8

## Priority: High

## Status: TODO

## Description

Implement the ProfileAnalyzer domain service that builds comprehensive user behavioral profiles from session and analytics data for LLM consumption.

## Acceptance Criteria

- [ ] Builds profiles from session history
- [ ] Calculates performance patterns
- [ ] Identifies learning patterns
- [ ] Tracks engagement patterns
- [ ] Analyzes help-seeking behavior
- [ ] Generates computed insights

## Technical Details

### UserBehavioralProfile Type

```typescript
// packages/core/src/domain/entities/UserProfile.ts

export interface UserBehavioralProfile {
  // Performance Patterns
  performance: {
    averageAccuracy: number;
    accuracyTrend: 'improving' | 'stable' | 'declining';
    averageResponseTime: number;
    responseTimeTrend: 'faster' | 'stable' | 'slower';
    positionStrength: number; // 0-1, how much better at position
    audioStrength: number;
    commonErrorPatterns: ErrorPattern[];
    fatigueIndicators: FatigueIndicator[];
  };

  // Learning Patterns
  learning: {
    currentLevel: string;
    progressionRate: 'fast' | 'normal' | 'slow';
    levelsCompleted: number;
    averageAttemptsPerLevel: number;
    plateauDetected: boolean;
    plateauDuration: number | null; // days
    recommendedNextLevel: string | null;
  };

  // Engagement Patterns
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

  // Help-Seeking Behavior
  helpSeeking: {
    popoverViewCount: number;
    averagePopoverDuration: number;
    tourCompleted: boolean;
    frequentlyViewedHelp: string[];
    helpViewTrend: 'increasing' | 'stable' | 'decreasing';
  };

  // Computed Insights
  insights: {
    strengths: string[];
    areasForImprovement: string[];
    motivationalFactors: string[];
    riskOfChurn: 'low' | 'medium' | 'high';
    suggestedInterventions: string[];
  };

  // Metadata
  profileGeneratedAt: Date;
  dataPointCount: number;
}

export interface ErrorPattern {
  type: 'position_miss' | 'audio_miss' | 'position_false_alarm' | 'audio_false_alarm';
  frequency: number;
  context: string;
}

export interface FatigueIndicator {
  type: 'accuracy_drop' | 'response_slowdown' | 'error_spike';
  typicalOnset: number; // trials into session
  severity: 'mild' | 'moderate' | 'severe';
}
```

### ProfileAnalyzer Service

```typescript
// packages/core/src/services/ProfileAnalyzer.ts

export class ProfileAnalyzer {
  buildProfile(
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

  private analyzePerformance(sessions: SessionResult[]) {
    if (sessions.length === 0) {
      return this.getDefaultPerformance();
    }

    const recentSessions = sessions.slice(-10);
    const accuracies = recentSessions.map(s => s.combinedAccuracy);
    const avgAccuracy = this.average(accuracies);

    // Trend analysis
    const accuracyTrend = this.calculateTrend(accuracies);

    // Response times
    const responseTimes = this.extractResponseTimes(recentSessions);
    const avgResponseTime = this.average(responseTimes);
    const responseTimeTrend = this.calculateTrend(responseTimes, 'lower_is_better');

    // Position vs Audio strength
    const positionAccuracies = recentSessions.map(s => s.positionStats.accuracy);
    const audioAccuracies = recentSessions.map(s => s.audioStats.accuracy);
    const positionStrength = this.average(positionAccuracies);
    const audioStrength = this.average(audioAccuracies);

    return {
      averageAccuracy: avgAccuracy,
      accuracyTrend,
      averageResponseTime: avgResponseTime,
      responseTimeTrend,
      positionStrength,
      audioStrength,
      commonErrorPatterns: this.findErrorPatterns(recentSessions),
      fatigueIndicators: this.detectFatigue(recentSessions),
    };
  }

  private analyzeLearning(sessions: SessionResult[], progress: UserProgress) {
    const levelHistory = this.getLevelHistory(sessions);
    const progressionRate = this.calculateProgressionRate(levelHistory);
    const plateauInfo = this.detectPlateau(sessions);

    return {
      currentLevel: progress.currentLevel,
      progressionRate,
      levelsCompleted: progress.unlockedLevels.length - 2, // minus initial unlocked
      averageAttemptsPerLevel: this.calculateAverageAttempts(levelHistory),
      plateauDetected: plateauInfo.detected,
      plateauDuration: plateauInfo.duration,
      recommendedNextLevel: this.recommendNextLevel(sessions, progress),
    };
  }

  private analyzeEngagement(sessions: SessionResult[], progress: UserProgress) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sessionsThisWeek = sessions.filter(s => s.timestamp > weekAgo).length;

    const sessionDurations = sessions.map(s => s.duration);
    const sessionTimes = sessions.map(s => s.timestamp.getHours());

    return {
      totalSessions: sessions.length,
      sessionsThisWeek,
      averageSessionsPerWeek: this.calculateWeeklyAverage(sessions),
      preferredTimeOfDay: this.detectPreferredTime(sessionTimes),
      averageSessionDuration: this.average(sessionDurations),
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lastSessionDate: progress.lastSessionDate,
      daysSinceLastSession: progress.lastSessionDate
        ? Math.floor((now.getTime() - progress.lastSessionDate.getTime()) / (24 * 60 * 60 * 1000))
        : null,
    };
  }

  private analyzeHelpSeeking(events: AnalyticsEvent[]) {
    const helpEvents = events.filter(e => e.category === 'help');
    const popoverEvents = helpEvents.filter(e => e.type === 'HELP_VIEWED');

    return {
      popoverViewCount: popoverEvents.length,
      averagePopoverDuration: this.average(
        popoverEvents.map(e => (e.payload as any).duration ?? 0)
      ),
      tourCompleted: helpEvents.some(e => e.type === 'TOUR_COMPLETED'),
      frequentlyViewedHelp: this.findFrequentHelp(popoverEvents),
      helpViewTrend: this.calculateHelpTrend(popoverEvents),
    };
  }

  private generateInsights(
    sessions: SessionResult[],
    progress: UserProgress,
    events: AnalyticsEvent[]
  ) {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const motivational: string[] = [];
    const interventions: string[] = [];

    // Analyze and populate insights...
    // (Implementation details for insight generation)

    return {
      strengths,
      areasForImprovement: improvements,
      motivationalFactors: motivational,
      riskOfChurn: this.assessChurnRisk(sessions, progress),
      suggestedInterventions: interventions,
    };
  }

  // Helper methods
  private average(nums: number[]): number {
    return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  }

  private calculateTrend(values: number[], direction: 'higher_is_better' | 'lower_is_better' = 'higher_is_better'): 'improving' | 'stable' | 'declining' {
    // Linear regression to determine trend
    // ...implementation
    return 'stable';
  }

  // ... additional helper methods
}
```

## Tasks

- [ ] Create UserBehavioralProfile type in core
- [ ] Create ProfileAnalyzer service
- [ ] Implement performance analysis
- [ ] Implement learning pattern analysis
- [ ] Implement engagement analysis
- [ ] Implement help-seeking analysis
- [ ] Implement insight generation
- [ ] Export from services index
- [ ] Write unit tests

## Dependencies

- Story 01-006 (Domain Entities)
- Story 03-003 (Dexie Database)
- Story 03-009 (Analytics Events)

## Notes

- Profile is regenerated on demand, not stored
- Insights power LLM prompts for personalization
- Trend analysis uses simple linear regression
