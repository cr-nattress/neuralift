import OpenAI from 'openai';
import { mkdir, writeFile, stat } from 'fs/promises';
import { dirname } from 'path';
import { logger } from '../utils/logger.js';
import { ProviderError } from '../utils/errors.js';
import type {
  TTSProvider,
  TTSProviderName,
  TTSOptions,
  TTSResult,
  OpenAIVoice,
  OpenAITTSModel,
} from '../types/tts.js';

/**
 * OpenAI TTS Provider
 */
export class OpenAITTSProvider implements TTSProvider {
  readonly name: TTSProviderName = 'openai';
  readonly defaultVoice: string = 'onyx';
  readonly defaultModel: string = 'tts-1-hd';

  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Generate speech from text and save to file
   */
  async generate(
    text: string,
    outputPath: string,
    options: TTSOptions = {}
  ): Promise<TTSResult> {
    const voice = (options.voice || this.defaultVoice) as OpenAIVoice;
    const model = (options.model || this.defaultModel) as OpenAITTSModel;
    const speed = options.speed ?? 1.0;

    // Ensure output directory exists
    const dir = dirname(outputPath);
    await mkdir(dir, { recursive: true });

    try {
      logger.debug(`Generating audio with OpenAI TTS: "${text}"`);
      logger.debug(`Voice: ${voice}, Model: ${model}, Speed: ${speed}`);

      const response = await this.client.audio.speech.create({
        model,
        voice,
        input: text,
        speed,
        response_format: 'mp3',
      });

      // Get the audio data as a buffer
      const buffer = Buffer.from(await response.arrayBuffer());

      // Write to file
      await writeFile(outputPath, buffer);

      // Get file stats
      const stats = await stat(outputPath);

      logger.debug(`Audio saved to ${outputPath} (${stats.size} bytes)`);

      return {
        outputPath,
        size: stats.size,
        provider: this.name,
        voice,
        model,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new ProviderError(
          `OpenAI TTS API error: ${error.message}`,
          this.name,
          error.status === 429
            ? 'Rate limited. Wait a moment and try again.'
            : undefined
        );
      }
      throw error;
    }
  }

  /**
   * Check if the provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get available voices
   */
  getVoices(): string[] {
    return ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  }
}

/**
 * Create an OpenAI TTS provider
 */
export function createOpenAITTS(apiKey: string): OpenAITTSProvider {
  return new OpenAITTSProvider(apiKey);
}
