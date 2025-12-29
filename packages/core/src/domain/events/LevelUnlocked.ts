/**
 * LevelUnlocked Event
 *
 * Emitted when a user unlocks a new training level.
 */

import type { DomainEvent } from './DomainEvent';

export interface LevelUnlocked extends DomainEvent {
  readonly type: 'LEVEL_UNLOCKED';
  readonly levelId: string;
}
