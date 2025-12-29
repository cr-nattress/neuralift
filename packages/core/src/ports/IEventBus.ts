/**
 * IEventBus Port
 *
 * Interface for domain event publishing and subscription.
 */

import type { DomainEvent } from '../domain/events/DomainEvent';

export interface IEventBus {
  publish(event: DomainEvent): void;
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => void
  ): () => void;
}
