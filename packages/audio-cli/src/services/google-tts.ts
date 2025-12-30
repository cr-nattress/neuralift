import textToSpeech from '@google-cloud/text-to-speech';
import { mkdir, writeFile, stat } from 'fs/promises';
import { dirname } from 'path';
import { logger } from '../utils/logger.js';
import { ProviderError } from '../utils/errors.js';
import type {
  TTSProvider,
  TTSProviderName,
  TTSOptions,
  TTSResult,
} from '../types/tts.js';

// Google TTS voice types
export type GoogleVoiceType = 'Standard' | 'Wavenet' | 'Neural2';

/**
 * Google Cloud TTS Provider
 */
export class GoogleTTSProvider implements TTSProvider {
  readonly name: TTSProviderName = 'google';
  readonly defaultVoice: string = 'en-US-Neural2-D';
  readonly defaultModel: string = 'Neural2';

  private client: textToSpeech.TextToSpeechClient;

  constructor(keyFilename?: string) {
    this.client = new textToSpeech.TextToSpeechClient({
      keyFilename,
    });
  }

  /**
   * Generate speech from text and save to file
   */
  async generate(
    text: string,
    outputPath: string,
    options: TTSOptions = {}
  ): Promise<TTSResult> {
    const voice = options.voice || this.defaultVoice;
    const speed = options.speed ?? 1.0;

    // Ensure output directory exists
    const dir = dirname(outputPath);
    await mkdir(dir, { recursive: true });

    try {
      logger.debug(`Generating audio with Google TTS: "${text}"`);
      logger.debug(`Voice: ${voice}, Speed: ${speed}`);

      const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: voice,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: speed,
          pitch: 0,
        },
      };

      const [response] = await this.client.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error('No audio content returned from Google TTS');
      }

      // Write to file
      const buffer = Buffer.from(response.audioContent as Uint8Array);
      await writeFile(outputPath, buffer);

      // Get file stats
      const stats = await stat(outputPath);

      logger.debug(`Audio saved to ${outputPath} (${stats.size} bytes)`);

      return {
        outputPath,
        size: stats.size,
        provider: this.name,
        voice,
        model: this.getVoiceType(voice),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ProviderError(
        `Google TTS API error: ${message}`,
        this.name,
        message.includes('PERMISSION_DENIED')
          ? 'Check your GCP credentials and TTS API access.'
          : undefined
      );
    }
  }

  /**
   * Check if the provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.client.listVoices({ languageCode: 'en-US' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get available voices
   */
  getVoices(): string[] {
    return [
      'en-US-Standard-A',
      'en-US-Standard-B',
      'en-US-Standard-C',
      'en-US-Standard-D',
      'en-US-Wavenet-A',
      'en-US-Wavenet-B',
      'en-US-Wavenet-C',
      'en-US-Wavenet-D',
      'en-US-Neural2-A',
      'en-US-Neural2-C',
      'en-US-Neural2-D',
      'en-US-Neural2-F',
    ];
  }

  /**
   * Extract voice type from voice name
   */
  private getVoiceType(voice: string): string {
    if (voice.includes('Neural2')) return 'Neural2';
    if (voice.includes('Wavenet')) return 'Wavenet';
    return 'Standard';
  }
}

/**
 * Create a Google Cloud TTS provider
 */
export function createGoogleTTS(keyFilename?: string): GoogleTTSProvider {
  return new GoogleTTSProvider(keyFilename);
}
