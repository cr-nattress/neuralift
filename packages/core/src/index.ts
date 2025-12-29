/**
 * @neuralift/core
 *
 * Framework-agnostic core domain module for the Neuralift Dual N-Back Training application.
 * Contains domain entities, port interfaces, services, use cases, and configuration.
 *
 * Architecture: Clean Architecture / Hexagonal Architecture
 * - Domain: Entities, Value Objects, Domain Events
 * - Ports: Interface contracts for external dependencies
 * - Services: Pure business logic
 * - Use Cases: Application-specific orchestration
 * - Config: Static configuration and level definitions
 */

// Domain layer
export * from './domain';

// Port interfaces
export * from './ports';

// Domain services
export * from './services';

// Use cases
export * from './use-cases';

// Configuration
export * from './config';

// Factory for dependency injection
export * from './factory';
