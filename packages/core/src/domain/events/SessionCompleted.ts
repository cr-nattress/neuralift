/**
 * SessionCompleted Event
 *
 * Emitted when a training session is completed.
 */

import type { DomainEvent } from './DomainEvent';

export interface SessionCompleted extends DomainEvent {
  readonly type: 'SESSION_COMPLETED';
  readonly levelId: string;
  readonly accuracy: number;
  readonly duration: number;
}

/**
 * Creates a SessionCompleted event
 */
export function createSessionCompletedEvent(
  aggregateId: string,
  levelId: string,
  accuracy: number,
  duration: number
): SessionCompleted {
  return {
    type: 'SESSION_COMPLETED',
    timestamp: new Date(),
    aggregateId,
    levelId,
    accuracy,
    duration,
  };
}
