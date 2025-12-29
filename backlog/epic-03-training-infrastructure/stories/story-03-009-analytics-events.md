# Story 03-009: Create Analytics Event System

## Story

**As a** developer
**I want** a comprehensive analytics event system
**So that** all user interactions are captured for personalization

## Points: 5

## Priority: High

## Status: TODO

## Description

Create the analytics event definitions and tracking hooks that capture user behavior throughout the application for LLM-powered recommendations.

## Acceptance Criteria

- [ ] Event types defined for all categories
- [ ] useAnalytics hook for easy tracking
- [ ] Auto-tracking for common events
- [ ] Session context attached to events
- [ ] Batched event submission

## Technical Details

### Event Type Definitions

```typescript
// packages/core/src/domain/events/AnalyticsEvents.ts

export type EventCategory =
  | 'session'
  | 'trial'
  | 'navigation'
  | 'interaction'
  | 'settings'
  | 'help'
  | 'performance'
  | 'engagement';

// Session Events
export interface SessionStartedEvent {
  type: 'SESSION_STARTED';
  category: 'session';
  payload: {
    sessionId: string;
    levelId: string;
    nBack: number;
    mode: string;
    trialCount: number;
  };
}

export interface SessionCompletedEvent {
  type: 'SESSION_COMPLETED';
  category: 'session';
  payload: {
    sessionId: string;
    duration: number;
    accuracy: number;
    positionAccuracy: number;
    audioAccuracy: number;
    dPrimePosition: number;
    dPrimeAudio: number;
  };
}

export interface SessionAbandonedEvent {
  type: 'SESSION_ABANDONED';
  category: 'session';
  payload: {
    sessionId: string;
    completedTrials: number;
    totalTrials: number;
    reason: 'user_quit' | 'navigation' | 'error';
  };
}

// Trial Events
export interface TrialCompletedEvent {
  type: 'TRIAL_COMPLETED';
  category: 'trial';
  payload: {
    sessionId: string;
    trialIndex: number;
    positionCorrect: boolean | null;
    audioCorrect: boolean | null;
    positionResponseTime: number | null;
    audioResponseTime: number | null;
    wasPositionMatch: boolean;
    wasAudioMatch: boolean;
  };
}

// Navigation Events
export interface PageViewedEvent {
  type: 'PAGE_VIEWED';
  category: 'navigation';
  payload: {
    page: string;
    referrer: string | null;
    timeOnPreviousPage: number | null;
  };
}

// Interaction Events
export interface ButtonClickedEvent {
  type: 'BUTTON_CLICKED';
  category: 'interaction';
  payload: {
    buttonId: string;
    context: string;
  };
}

// Help Events
export interface HelpViewedEvent {
  type: 'HELP_VIEWED';
  category: 'help';
  payload: {
    helpId: string;
    context: string;
    duration: number;
  };
}

export interface TourStepViewedEvent {
  type: 'TOUR_STEP_VIEWED';
  category: 'help';
  payload: {
    stepIndex: number;
    stepId: string;
  };
}

// Settings Events
export interface SettingChangedEvent {
  type: 'SETTING_CHANGED';
  category: 'settings';
  payload: {
    setting: string;
    oldValue: unknown;
    newValue: unknown;
  };
}

// Engagement Events
export interface AppOpenedEvent {
  type: 'APP_OPENED';
  category: 'engagement';
  payload: {
    daysSinceLastVisit: number | null;
    currentStreak: number;
  };
}

export type AnalyticsEventType =
  | SessionStartedEvent
  | SessionCompletedEvent
  | SessionAbandonedEvent
  | TrialCompletedEvent
  | PageViewedEvent
  | ButtonClickedEvent
  | HelpViewedEvent
  | TourStepViewedEvent
  | SettingChangedEvent
  | AppOpenedEvent;
```

### useAnalytics Hook

```typescript
// src/application/hooks/useAnalytics.ts
'use client';

import { useCallback, useRef } from 'react';
import { useCore } from '../providers/CoreProvider';
import type { AnalyticsEventType } from '@neuralift/core';

export function useAnalytics() {
  const core = useCore();
  const eventBuffer = useRef<AnalyticsEventType[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const track = useCallback(
    (event: Omit<AnalyticsEventType, 'timestamp'>) => {
      const fullEvent = {
        ...event,
        timestamp: new Date(),
      } as AnalyticsEventType;

      eventBuffer.current.push(fullEvent);

      // Batch events - flush after 1 second of inactivity
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
      flushTimeoutRef.current = setTimeout(() => {
        if (eventBuffer.current.length > 0) {
          core.services.analyticsRepository
            .trackEvents(eventBuffer.current)
            .catch(console.error);
          eventBuffer.current = [];
        }
      }, 1000);
    },
    [core]
  );

  const trackImmediate = useCallback(
    async (event: Omit<AnalyticsEventType, 'timestamp'>) => {
      const fullEvent = {
        ...event,
        timestamp: new Date(),
      } as AnalyticsEventType;

      await core.services.analyticsRepository.trackEvent(fullEvent);
    },
    [core]
  );

  // Convenience methods
  const trackPageView = useCallback(
    (page: string, referrer?: string) => {
      track({
        type: 'PAGE_VIEWED',
        category: 'navigation',
        payload: {
          page,
          referrer: referrer ?? null,
          timeOnPreviousPage: null,
        },
      });
    },
    [track]
  );

  const trackHelpViewed = useCallback(
    (helpId: string, context: string, duration: number) => {
      track({
        type: 'HELP_VIEWED',
        category: 'help',
        payload: { helpId, context, duration },
      });
    },
    [track]
  );

  return {
    track,
    trackImmediate,
    trackPageView,
    trackHelpViewed,
  };
}
```

## Tasks

- [ ] Create event type definitions in core
- [ ] Create useAnalytics hook
- [ ] Implement event batching
- [ ] Add convenience methods for common events
- [ ] Export from application hooks
- [ ] Test event tracking in browser

## Dependencies

- Story 03-008 (Analytics Repository)
- Story 01-008 (Core Provider)

## Notes

- Batching reduces IndexedDB writes
- All events have timestamps for sequencing
- Categories enable filtering for profile building
