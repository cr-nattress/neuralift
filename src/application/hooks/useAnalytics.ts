'use client';

/**
 * useAnalytics Hook
 *
 * Provides methods to track analytics events with batching support.
 * Events are queued and flushed periodically for performance.
 */

import { useCallback, useRef, useEffect } from 'react';
import { useCore } from '../providers/CoreProvider';
import type { AnalyticsEvent, EventCategory, TrainingMode, NBackLevel } from '@neuralift/core';

/** Batch flush interval in milliseconds */
const FLUSH_INTERVAL_MS = 5000;

/** Maximum events to batch before auto-flush */
const MAX_BATCH_SIZE = 20;

/**
 * Event input for tracking (timestamp auto-added)
 */
export interface TrackEventInput {
  type: string;
  category: EventCategory;
  sessionId?: string;
  payload: Record<string, unknown>;
}

/**
 * Session start event input
 */
export interface SessionStartInput {
  sessionId: string;
  levelId: string;
  nBack: NBackLevel;
  mode: TrainingMode;
  trialCount: number;
}

/**
 * Session complete event input
 */
export interface SessionCompleteInput {
  sessionId: string;
  levelId: string;
  nBack: NBackLevel;
  mode: TrainingMode;
  duration: number;
  accuracy: number;
  positionAccuracy: number;
  audioAccuracy: number;
  dPrimePosition: number;
  dPrimeAudio: number;
}

/**
 * Hook return type
 */
export interface UseAnalyticsReturn {
  /** Track an event (batched) */
  track: (event: TrackEventInput) => void;
  /** Track an event immediately (bypasses batching) */
  trackImmediate: (event: TrackEventInput) => Promise<void>;
  /** Flush all pending events */
  flush: () => Promise<void>;
  /** Track page view */
  trackPageView: (page: string, referrer?: string) => void;
  /** Track button click */
  trackButtonClick: (buttonId: string, context: string) => void;
  /** Track help viewed */
  trackHelpViewed: (helpId: string, context: string, duration: number) => void;
  /** Track setting changed */
  trackSettingChanged: (setting: string, oldValue: unknown, newValue: unknown) => void;
  /** Track app opened */
  trackAppOpened: (daysSinceLastVisit: number | null, currentStreak: number, totalSessions: number) => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const core = useCore();
  const eventQueueRef = useRef<AnalyticsEvent[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Flush all pending events to storage
   */
  const flush = useCallback(async () => {
    if (eventQueueRef.current.length === 0) return;

    const events = [...eventQueueRef.current];
    eventQueueRef.current = [];

    try {
      await core.repositories.analytics.trackEvents(events);
    } catch (error) {
      console.error('[useAnalytics] Failed to flush events:', error);
      // Re-queue events on failure
      eventQueueRef.current = [...events, ...eventQueueRef.current];
    }
  }, [core.repositories.analytics]);

  /**
   * Schedule a flush if not already scheduled
   */
  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) return;

    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      void flush();
    }, FLUSH_INTERVAL_MS);
  }, [flush]);

  /**
   * Track an event (batched for performance)
   */
  const track = useCallback(
    (input: TrackEventInput) => {
      const event: AnalyticsEvent = {
        type: input.type,
        category: input.category,
        timestamp: new Date(),
        payload: input.payload,
      };

      if (input.sessionId) {
        event.sessionId = input.sessionId;
      }

      eventQueueRef.current.push(event);

      // Auto-flush if batch size exceeded
      if (eventQueueRef.current.length >= MAX_BATCH_SIZE) {
        void flush();
      } else {
        scheduleFlush();
      }
    },
    [flush, scheduleFlush]
  );

  /**
   * Track an event immediately (bypasses batching)
   */
  const trackImmediate = useCallback(
    async (input: TrackEventInput) => {
      const event: AnalyticsEvent = {
        type: input.type,
        category: input.category,
        timestamp: new Date(),
        payload: input.payload,
      };

      if (input.sessionId) {
        event.sessionId = input.sessionId;
      }

      await core.repositories.analytics.trackEvent(event);
    },
    [core.repositories.analytics]
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }
      // Sync flush on unmount
      if (eventQueueRef.current.length > 0) {
        void core.repositories.analytics.trackEvents(eventQueueRef.current);
      }
    };
  }, [core.repositories.analytics]);

  // Flush on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (eventQueueRef.current.length > 0) {
        // Use synchronous approach for beforeunload
        const events = eventQueueRef.current;
        eventQueueRef.current = [];
        void core.repositories.analytics.trackEvents(events);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [core.repositories.analytics]);

  // ============================================================================
  // Convenience Methods
  // ============================================================================

  /**
   * Track page view
   */
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

  /**
   * Track button click
   */
  const trackButtonClick = useCallback(
    (buttonId: string, context: string) => {
      track({
        type: 'BUTTON_CLICKED',
        category: 'interaction',
        payload: { buttonId, context },
      });
    },
    [track]
  );

  /**
   * Track help viewed
   */
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

  /**
   * Track setting changed
   */
  const trackSettingChanged = useCallback(
    (setting: string, oldValue: unknown, newValue: unknown) => {
      track({
        type: 'SETTING_CHANGED',
        category: 'settings',
        payload: { setting, oldValue, newValue },
      });
    },
    [track]
  );

  /**
   * Track app opened
   */
  const trackAppOpened = useCallback(
    (daysSinceLastVisit: number | null, currentStreak: number, totalSessions: number) => {
      track({
        type: 'APP_OPENED',
        category: 'engagement',
        payload: { daysSinceLastVisit, currentStreak, totalSessions },
      });
    },
    [track]
  );

  return {
    track,
    trackImmediate,
    flush,
    trackPageView,
    trackButtonClick,
    trackHelpViewed,
    trackSettingChanged,
    trackAppOpened,
  };
}
