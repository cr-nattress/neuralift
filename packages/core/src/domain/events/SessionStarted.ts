/**
 * SessionStarted Event
 *
 * Emitted when a new training session begins.
 */

import type { DomainEvent } from './DomainEvent';

export interface SessionStarted extends DomainEvent {
  readonly type: 'SESSION_STARTED';
  readonly levelId: string;
}
