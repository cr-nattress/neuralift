/**
 * Audio CLI Types
 */

// Import types for use in this file
import type { LLMProviderName } from './llm.js';
import type { TTSProviderName } from './tts.js';

// Re-export LLM and TTS types
export * from './llm.js';
export * from './tts.js';

// Audio file types
export type AudioType = 'letter' | 'feedback';
export type FeedbackType = 'correct' | 'incorrect' | 'tick' | 'complete';

// Letters used in dual n-back training
export const TRAINING_LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'] as const;
export type TrainingLetter = (typeof TRAINING_LETTERS)[number];

// Audio specifications
export interface AudioSpec {
  format: 'mp3';
  sampleRate: 44100;
  bitRate: 128;
  minDuration: number;
  maxDuration: number;
}

export const AUDIO_SPECS: Record<AudioType | FeedbackType, AudioSpec> = {
  letter: {
    format: 'mp3',
    sampleRate: 44100,
    bitRate: 128,
    minDuration: 0.5,
    maxDuration: 1.5,
  },
  feedback: {
    format: 'mp3',
    sampleRate: 44100,
    bitRate: 128,
    minDuration: 0.2,
    maxDuration: 0.5,
  },
  correct: {
    format: 'mp3',
    sampleRate: 44100,
    bitRate: 128,
    minDuration: 0.2,
    maxDuration: 0.5,
  },
  incorrect: {
    format: 'mp3',
    sampleRate: 44100,
    bitRate: 128,
    minDuration: 0.2,
    maxDuration: 0.5,
  },
  tick: {
    format: 'mp3',
    sampleRate: 44100,
    bitRate: 128,
    minDuration: 0.05,
    maxDuration: 0.1,
  },
  complete: {
    format: 'mp3',
    sampleRate: 44100,
    bitRate: 128,
    minDuration: 0.5,
    maxDuration: 1.0,
  },
};

// Configuration types
export interface Config {
  // LLM API Keys
  openaiApiKey?: string;
  anthropicApiKey?: string;
  googleApiKey?: string;

  // GCP Configuration
  gcpProjectId?: string;
  gcpBucketName?: string;
  gcpKeyFile?: string;

  // Default providers
  defaultLLMProvider: LLMProviderName;
  defaultTTSProvider: TTSProviderName;

  // Output settings
  outputDir: string;
  verbose: boolean;
}

// Command context passed to handlers
export interface CommandContext {
  config: Config;
  verbose: boolean;
}

// Audio generation options
export interface AudioGenerateOptions {
  provider?: TTSProviderName;
  voice?: string;
  output?: string;
  overwrite?: boolean;
}

// Storage options
export interface StorageOptions {
  bucket?: string;
  prefix?: string;
}

// Analysis result
export interface AudioAnalysis {
  file: string;
  duration: number;
  format: string;
  sampleRate: number;
  bitRate: number;
  channels: number;
  size: number;
  valid: boolean;
  issues: string[];
}
