import { logger, isVerbose } from './logger.js';

/**
 * Base error class for CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestion?: string
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

/**
 * Configuration-related errors
 */
export class ConfigError extends CLIError {
  constructor(message: string, suggestion?: string) {
    super(message, 'CONFIG_ERROR', suggestion);
    this.name = 'ConfigError';
  }
}

/**
 * Provider-related errors (API, TTS, etc.)
 */
export class ProviderError extends CLIError {
  constructor(
    message: string,
    public readonly provider: string,
    suggestion?: string
  ) {
    super(message, 'PROVIDER_ERROR', suggestion);
    this.name = 'ProviderError';
  }
}

/**
 * Storage-related errors (GCP, file system)
 */
export class StorageError extends CLIError {
  constructor(
    message: string,
    public readonly operation?: string,
    public readonly bucket?: string,
    suggestion?: string
  ) {
    super(message, 'STORAGE_ERROR', suggestion);
    this.name = 'StorageError';
  }
}

/**
 * Audio processing errors
 */
export class AudioError extends CLIError {
  constructor(message: string, suggestion?: string) {
    super(message, 'AUDIO_ERROR', suggestion);
    this.name = 'AudioError';
  }
}

/**
 * Handle errors and exit the process
 */
export function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    logger.error(error.message);

    if (error.suggestion) {
      logger.info(`Suggestion: ${error.suggestion}`);
    }

    if (isVerbose() && error.stack) {
      logger.debug('Stack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  }

  if (error instanceof Error) {
    logger.error(error.message);

    if (isVerbose() && error.stack) {
      logger.debug('Stack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  }

  logger.error('An unexpected error occurred');
  console.error(error);
  process.exit(1);
}

/**
 * Wrapper for async command handlers
 */
export function withErrorHandling<T extends unknown[]>(
  fn: (...args: T) => Promise<void>
): (...args: T) => Promise<void> {
  return async (...args: T): Promise<void> => {
    try {
      await fn(...args);
    } catch (error) {
      handleError(error);
    }
  };
}
