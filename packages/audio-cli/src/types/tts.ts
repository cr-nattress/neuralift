/**
 * TTS (Text-to-Speech) Provider Types
 */

export type TTSProviderName = 'openai' | 'google';

// OpenAI TTS voice options
export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// OpenAI TTS model options
export type OpenAITTSModel = 'tts-1' | 'tts-1-hd';

/**
 * Options for TTS generation
 */
export interface TTSOptions {
  /** Voice to use (provider-specific) */
  voice?: string;
  /** Model to use (provider-specific) */
  model?: string;
  /** Speed of speech (0.25 to 4.0, default 1.0) */
  speed?: number;
  /** Output format */
  format?: 'mp3' | 'opus' | 'aac' | 'flac';
}

/**
 * Result from TTS generation
 */
export interface TTSResult {
  /** Path to generated audio file */
  outputPath: string;
  /** Duration in seconds (if available) */
  duration?: number;
  /** File size in bytes */
  size: number;
  /** Provider used */
  provider: TTSProviderName;
  /** Voice used */
  voice: string;
  /** Model used */
  model: string;
}

/**
 * Common interface for TTS providers
 */
export interface TTSProvider {
  /** Provider name */
  readonly name: TTSProviderName;

  /** Default voice for this provider */
  readonly defaultVoice: string;

  /** Default model for this provider */
  readonly defaultModel: string;

  /**
   * Generate speech from text and save to file
   */
  generate(
    text: string,
    outputPath: string,
    options?: TTSOptions
  ): Promise<TTSResult>;

  /**
   * Check if the provider is available
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get available voices
   */
  getVoices(): string[];
}

/**
 * Letter pronunciation mapping for optimal TTS output
 * Uses phonetic spellings that produce clearer audio
 */
export const LETTER_PRONUNCIATIONS: Record<string, string> = {
  C: 'See',
  H: 'Aitch',
  K: 'Kay',
  L: 'Ell',
  Q: 'Cue',
  R: 'Are',
  S: 'Ess',
  T: 'Tee',
};

/**
 * Feedback sound text templates
 */
export const FEEDBACK_TEXT: Record<string, string> = {
  correct: 'Correct!',
  incorrect: 'Try again',
  tick: 'tick',
  complete: 'Session complete. Well done!',
};

/**
 * OpenAI TTS pricing (per 1M characters)
 */
export const OPENAI_TTS_PRICING = {
  'tts-1': 15.0,
  'tts-1-hd': 30.0,
};

/**
 * Recommended voices for different use cases
 */
export const RECOMMENDED_VOICES = {
  letters: 'onyx',      // Deep, clear voice for letter clarity
  feedback: 'nova',     // Friendly voice for feedback
  default: 'alloy',     // Neutral general purpose
};
