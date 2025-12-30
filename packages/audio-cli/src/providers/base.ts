import { logger } from '../utils/logger.js';
import { ProviderError } from '../utils/errors.js';
import type {
  LLMProvider,
  LLMProviderName,
  GenerateOptions,
  GenerateResult,
  ProviderPricing,
} from '../types/llm.js';

/**
 * Default retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig
): number {
  const exponentialDelay =
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
  // Add jitter (±25%)
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(cappedDelay + jitter);
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Rate limits and temporary errors
    if (
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('429') ||
      message.includes('503') ||
      message.includes('timeout') ||
      message.includes('temporarily') ||
      message.includes('overloaded')
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Base class for LLM providers with common functionality
 */
export abstract class BaseLLMProvider implements LLMProvider {
  abstract readonly name: LLMProviderName;
  abstract readonly defaultModel: string;

  protected apiKey: string;
  protected retryConfig: RetryConfig;

  constructor(apiKey: string, retryConfig: Partial<RetryConfig> = {}) {
    this.apiKey = apiKey;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Abstract method for actual API call - to be implemented by subclasses
   */
  protected abstract doGenerate(
    prompt: string,
    options: GenerateOptions
  ): Promise<GenerateResult>;

  /**
   * Generate with automatic retry logic
   */
  async generate(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<GenerateResult> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = calculateBackoffDelay(attempt - 1, this.retryConfig);
          logger.debug(
            `Retry attempt ${attempt}/${this.retryConfig.maxRetries} after ${delay}ms`
          );
          await sleep(delay);
        }

        const result = await this.doGenerate(prompt, options);

        // Log successful request
        logger.debug(
          `[${this.name}] Generated ${result.usage.completionTokens} tokens ` +
          `(cost: $${result.estimatedCost.toFixed(6)})`
        );

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (isRetryableError(error) && attempt < this.retryConfig.maxRetries) {
          logger.warn(
            `[${this.name}] Request failed (attempt ${attempt + 1}): ${lastError.message}`
          );
          continue;
        }

        // Non-retryable error or max retries exceeded
        throw new ProviderError(
          `${this.name} API error: ${lastError.message}`,
          this.name,
          attempt >= this.retryConfig.maxRetries
            ? 'Max retries exceeded. Try again later.'
            : undefined
        );
      }
    }

    // Should never reach here, but TypeScript requires it
    throw lastError;
  }

  /**
   * Check if provider is available (has API key)
   */
  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey);
  }

  /**
   * Estimate cost for token usage
   */
  estimateCost(inputTokens: number, outputTokens: number): number {
    const pricing = this.getPricing();
    return (
      (inputTokens / 1_000_000) * pricing.input +
      (outputTokens / 1_000_000) * pricing.output
    );
  }

  /**
   * Get pricing for the default model - to be overridden by subclasses
   */
  abstract getPricing(model?: string): ProviderPricing;
}

/**
 * Count tokens (approximate - for estimation purposes)
 * Uses ~4 chars per token as a rough estimate
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
