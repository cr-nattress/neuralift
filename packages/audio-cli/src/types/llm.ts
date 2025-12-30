/**
 * LLM Provider Types
 */

export type LLMProviderName = 'openai' | 'anthropic' | 'gemini';

/**
 * Options for text generation
 */
export interface GenerateOptions {
  /** Model to use (provider-specific) */
  model?: string;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Temperature for randomness (0-1) */
  temperature?: number;
  /** System prompt/instructions */
  systemPrompt?: string;
  /** Stop sequences */
  stopSequences?: string[];
}

/**
 * Result from text generation
 */
export interface GenerateResult {
  /** Generated text content */
  content: string;
  /** Model used */
  model: string;
  /** Token usage */
  usage: TokenUsage;
  /** Estimated cost in USD */
  estimatedCost: number;
  /** Provider name */
  provider: LLMProviderName;
}

/**
 * Token usage tracking
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Provider pricing per 1M tokens
 */
export interface ProviderPricing {
  input: number;
  output: number;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  apiKey: string;
  defaultModel: string;
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
}

/**
 * Common interface for all LLM providers
 */
export interface LLMProvider {
  /** Provider name */
  readonly name: LLMProviderName;

  /** Default model for this provider */
  readonly defaultModel: string;

  /**
   * Generate text from a prompt
   */
  generate(prompt: string, options?: GenerateOptions): Promise<GenerateResult>;

  /**
   * Generate text with streaming response
   */
  stream?(
    prompt: string,
    options?: GenerateOptions
  ): AsyncIterable<string>;

  /**
   * Check if the provider is available (has valid API key, etc.)
   */
  isAvailable(): Promise<boolean>;

  /**
   * Estimate cost for a given number of tokens
   */
  estimateCost(inputTokens: number, outputTokens: number): number;

  /**
   * Get the pricing for this provider
   */
  getPricing(model?: string): ProviderPricing;
}

/**
 * Model configurations with pricing
 */
export const MODEL_PRICING: Record<string, ProviderPricing> = {
  // OpenAI models (per 1M tokens)
  'gpt-4-turbo-preview': { input: 10.0, output: 30.0 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-4o': { input: 5.0, output: 15.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },

  // Anthropic models (per 1M tokens)
  'claude-3-opus-20240229': { input: 15.0, output: 75.0 },
  'claude-3-sonnet-20240229': { input: 3.0, output: 15.0 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },

  // Google models (per 1M tokens)
  'gemini-pro': { input: 0.5, output: 1.5 },
  'gemini-1.5-pro': { input: 3.5, output: 10.5 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
};

/**
 * Default models for each provider
 */
export const DEFAULT_MODELS: Record<LLMProviderName, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-1.5-flash',
};
