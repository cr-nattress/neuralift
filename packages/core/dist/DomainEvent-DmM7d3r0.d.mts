/**
 * Base Domain Event
 *
 * All domain events extend this interface.
 */
interface DomainEvent {
    readonly type: string;
    readonly timestamp: Date;
    readonly aggregateId: string;
}

export type { DomainEvent as D };
