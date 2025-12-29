'use client';

/**
 * Stub implementation of IEventBus for browser environment
 * Full implementation will be completed in Epic 03
 */

import type { IEventBus, DomainEvent } from '@neuralift/core';

type EventHandler<T extends DomainEvent> = (event: T) => void;

export class BrowserEventBus implements IEventBus {
  private handlers = new Map<string, Set<EventHandler<DomainEvent>>>();

  publish(event: DomainEvent): void {
    console.log('[BrowserEventBus] publish:', event.type);
    const eventHandlers = this.handlers.get(event.type);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => handler(event));
    }
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => void
  ): () => void {
    console.log('[BrowserEventBus] subscribe:', eventType);

    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const eventHandlers = this.handlers.get(eventType);
    eventHandlers?.add(handler as EventHandler<DomainEvent>);

    // Return unsubscribe function
    return () => {
      eventHandlers?.delete(handler as EventHandler<DomainEvent>);
    };
  }
}
