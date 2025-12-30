import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { GeminiProvider } from './gemini.js';
import { ConfigError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import type { LLMProvider, LLMProviderName } from '../types/llm.js';
import type { Config } from '../types/index.js';

/**
 * Provider registry - caches provider instances
 */
const providerCache: Map<LLMProviderName, LLMProvider> = new Map();

/**
 * Get or create an LLM provider instance
 */
export function getProvider(
  name: LLMProviderName,
  config: Config
): LLMProvider {
  // Check cache first
  const cached = providerCache.get(name);
  if (cached) {
    return cached;
  }

  // Create new provider
  const provider = createProvider(name, config);
  providerCache.set(name, provider);

  return provider;
}

/**
 * Create a new provider instance
 */
function createProvider(
  name: LLMProviderName,
  config: Config
): LLMProvider {
  switch (name) {
    case 'openai': {
      if (!config.openaiApiKey) {
        throw new ConfigError(
          'OpenAI API key is required',
          'Set OPENAI_API_KEY environment variable'
        );
      }
      return new OpenAIProvider(config.openaiApiKey);
    }

    case 'anthropic': {
      if (!config.anthropicApiKey) {
        throw new ConfigError(
          'Anthropic API key is required',
          'Set ANTHROPIC_API_KEY environment variable'
        );
      }
      return new AnthropicProvider(config.anthropicApiKey);
    }

    case 'gemini': {
      if (!config.googleApiKey) {
        throw new ConfigError(
          'Google AI API key is required',
          'Set GOOGLE_API_KEY environment variable'
        );
      }
      return new GeminiProvider(config.googleApiKey);
    }

    default:
      throw new ConfigError(`Unknown LLM provider: ${name}`);
  }
}

/**
 * Get the default provider based on configuration
 */
export function getDefaultProvider(config: Config): LLMProvider {
  return getProvider(config.defaultLLMProvider, config);
}

/**
 * Get all available providers (those with API keys configured)
 */
export function getAvailableProviders(config: Config): LLMProviderName[] {
  const available: LLMProviderName[] = [];

  if (config.openaiApiKey) available.push('openai');
  if (config.anthropicApiKey) available.push('anthropic');
  if (config.googleApiKey) available.push('gemini');

  return available;
}

/**
 * Try to get a provider with fallback to alternatives
 */
export async function getProviderWithFallback(
  preferred: LLMProviderName,
  config: Config
): Promise<LLMProvider> {
  const available = getAvailableProviders(config);

  if (available.length === 0) {
    throw new ConfigError(
      'No LLM providers configured',
      'Set at least one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY'
    );
  }

  // Try preferred provider first
  if (available.includes(preferred)) {
    try {
      const provider = getProvider(preferred, config);
      if (await provider.isAvailable()) {
        return provider;
      }
    } catch (error) {
      logger.warn(`Preferred provider ${preferred} unavailable, trying alternatives...`);
    }
  }

  // Try alternatives
  for (const name of available) {
    if (name === preferred) continue;

    try {
      const provider = getProvider(name, config);
      if (await provider.isAvailable()) {
        logger.info(`Using fallback provider: ${name}`);
        return provider;
      }
    } catch {
      // Continue to next provider
    }
  }

  throw new ConfigError(
    'No LLM providers are currently available',
    'Check your API keys and network connection'
  );
}

/**
 * Clear the provider cache (useful for testing)
 */
export function clearProviderCache(): void {
  providerCache.clear();
}
