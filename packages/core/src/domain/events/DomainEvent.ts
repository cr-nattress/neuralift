/**
 * Base Domain Event
 *
 * All domain events extend this interface.
 */

export interface DomainEvent {
  readonly type: string;
  readonly timestamp: Date;
  readonly aggregateId: string;
}
