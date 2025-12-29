/**
 * TrialCompleted Event
 *
 * Emitted when a trial is completed with a response.
 */

import type { DomainEvent } from './DomainEvent';

export interface TrialCompleted extends DomainEvent {
  readonly type: 'TRIAL_COMPLETED';
  readonly trialId: string;
  readonly correct: boolean;
}
