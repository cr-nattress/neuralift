import { join } from 'path';
import { mkdir } from 'fs/promises';
import { ConfigError } from '../utils/errors.js';
import { loadConfig } from '../utils/config.js';
import { OpenAITTSProvider } from './openai-tts.js';
import type { TTSProvider, TTSOptions, TTSResult } from '../types/tts.js';
import {
  LETTER_PRONUNCIATIONS,
  FEEDBACK_TEXT,
  RECOMMENDED_VOICES,
} from '../types/tts.js';
import { TRAINING_LETTERS, type TrainingLetter } from '../types/index.js';

/**
 * Audio generation service
 */
export class AudioGenerator {
  private ttsProvider: TTSProvider;
  private outputDir: string;

  constructor(ttsProvider: TTSProvider, outputDir: string) {
    this.ttsProvider = ttsProvider;
    this.outputDir = outputDir;
  }

  /**
   * Generate audio for a single letter
   */
  async generateLetter(
    letter: TrainingLetter,
    options: TTSOptions = {}
  ): Promise<TTSResult> {
    const pronunciation = LETTER_PRONUNCIATIONS[letter];
    if (!pronunciation) {
      throw new ConfigError(`No pronunciation defined for letter: ${letter}`);
    }

    const outputPath = join(this.outputDir, 'letters', `${letter.toLowerCase()}.mp3`);

    // Use recommended voice for letters if not specified
    const ttsOptions: TTSOptions = {
      voice: options.voice || RECOMMENDED_VOICES.letters,
      ...options,
    };

    return this.ttsProvider.generate(pronunciation, outputPath, ttsOptions);
  }

  /**
   * Generate audio for all training letters
   */
  async generateAllLetters(
    options: TTSOptions = {},
    onProgress?: (letter: string, current: number, total: number) => void
  ): Promise<TTSResult[]> {
    const results: TTSResult[] = [];

    // Ensure output directory exists
    await mkdir(join(this.outputDir, 'letters'), { recursive: true });

    for (let i = 0; i < TRAINING_LETTERS.length; i++) {
      const letter = TRAINING_LETTERS[i];

      if (onProgress) {
        onProgress(letter, i + 1, TRAINING_LETTERS.length);
      }

      const result = await this.generateLetter(letter, options);
      results.push(result);
    }

    return results;
  }

  /**
   * Generate a feedback sound
   */
  async generateFeedback(
    type: 'correct' | 'incorrect' | 'tick' | 'complete',
    options: TTSOptions = {}
  ): Promise<TTSResult> {
    const text = FEEDBACK_TEXT[type];
    if (!text) {
      throw new ConfigError(`No text defined for feedback type: ${type}`);
    }

    const outputPath = join(this.outputDir, 'feedback', `${type}.mp3`);

    // Use recommended voice for feedback if not specified
    const ttsOptions: TTSOptions = {
      voice: options.voice || RECOMMENDED_VOICES.feedback,
      ...options,
    };

    return this.ttsProvider.generate(text, outputPath, ttsOptions);
  }

  /**
   * Generate all feedback sounds
   */
  async generateAllFeedback(
    options: TTSOptions = {},
    onProgress?: (type: string, current: number, total: number) => void
  ): Promise<TTSResult[]> {
    const types: Array<'correct' | 'incorrect' | 'tick' | 'complete'> = [
      'correct',
      'incorrect',
      'tick',
      'complete',
    ];
    const results: TTSResult[] = [];

    // Ensure output directory exists
    await mkdir(join(this.outputDir, 'feedback'), { recursive: true });

    for (let i = 0; i < types.length; i++) {
      const type = types[i];

      if (onProgress) {
        onProgress(type, i + 1, types.length);
      }

      const result = await this.generateFeedback(type, options);
      results.push(result);
    }

    return results;
  }
}

/**
 * Create an audio generator with OpenAI TTS
 */
export function createAudioGenerator(): AudioGenerator {
  const config = loadConfig();

  if (!config.openaiApiKey) {
    throw new ConfigError(
      'OpenAI API key is required for audio generation',
      'Set OPENAI_API_KEY environment variable'
    );
  }

  const ttsProvider = new OpenAITTSProvider(config.openaiApiKey);
  return new AudioGenerator(ttsProvider, config.outputDir);
}
