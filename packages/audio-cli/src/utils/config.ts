import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import type { Config, LLMProviderName, TTSProviderName } from '../types/index.js';
import { ConfigError } from './errors.js';
import { logger } from './logger.js';

// Load environment variables
dotenvConfig();

/**
 * Get configuration from environment variables
 */
export function loadConfig(): Config {
  const config: Config = {
    // LLM API Keys
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    googleApiKey: process.env.GOOGLE_API_KEY,

    // GCP Configuration
    gcpProjectId: process.env.GCP_PROJECT_ID,
    gcpBucketName: process.env.GCP_BUCKET_NAME || 'neuralift-audio',
    gcpKeyFile: process.env.GCP_KEY_FILE,

    // Default providers
    defaultLLMProvider: (process.env.DEFAULT_LLM_PROVIDER as LLMProviderName) || 'openai',
    defaultTTSProvider: (process.env.DEFAULT_TTS_PROVIDER as TTSProviderName) || 'openai',

    // Output settings
    outputDir: process.env.OUTPUT_DIR || resolve(process.cwd(), 'audio-output'),
    verbose: process.env.VERBOSE === 'true',
  };

  return config;
}

/**
 * Validate that required configuration exists for a given provider
 */
export function validateProviderConfig(
  config: Config,
  provider: LLMProviderName | TTSProviderName
): void {
  switch (provider) {
    case 'openai':
      if (!config.openaiApiKey) {
        throw new ConfigError(
          'OpenAI API key is required',
          'Set OPENAI_API_KEY environment variable or use --api-key flag'
        );
      }
      break;
    case 'anthropic':
      if (!config.anthropicApiKey) {
        throw new ConfigError(
          'Anthropic API key is required',
          'Set ANTHROPIC_API_KEY environment variable'
        );
      }
      break;
    case 'google':
    case 'gemini':
      if (!config.googleApiKey && !config.gcpKeyFile) {
        throw new ConfigError(
          'Google API key or service account key file is required',
          'Set GOOGLE_API_KEY or GCP_KEY_FILE environment variable'
        );
      }
      break;
  }
}

/**
 * Validate GCP storage configuration
 */
export function validateStorageConfig(config: Config): void {
  if (!config.gcpProjectId) {
    throw new ConfigError(
      'GCP Project ID is required for storage operations',
      'Set GCP_PROJECT_ID environment variable'
    );
  }

  if (!config.gcpBucketName) {
    throw new ConfigError(
      'GCP Bucket name is required',
      'Set GCP_BUCKET_NAME environment variable'
    );
  }
}

/**
 * Print current configuration (sanitized)
 */
export function printConfig(config: Config): void {
  logger.section('Current Configuration');

  logger.keyValue('Default LLM Provider', config.defaultLLMProvider);
  logger.keyValue('Default TTS Provider', config.defaultTTSProvider);
  logger.keyValue('Output Directory', config.outputDir);
  logger.keyValue('GCP Bucket', config.gcpBucketName || 'Not configured');
  logger.keyValue('GCP Project', config.gcpProjectId || 'Not configured');

  logger.newline();
  logger.keyValue('OpenAI API Key', config.openaiApiKey ? '✓ Set' : '✗ Not set');
  logger.keyValue('Anthropic API Key', config.anthropicApiKey ? '✓ Set' : '✗ Not set');
  logger.keyValue('Google API Key', config.googleApiKey ? '✓ Set' : '✗ Not set');
  logger.keyValue('GCP Key File', config.gcpKeyFile ? '✓ Set' : '✗ Not set');
}
