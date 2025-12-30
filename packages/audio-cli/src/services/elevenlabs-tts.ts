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

// ElevenLabs voice IDs
export const ELEVENLABS_VOICES = {
  adam: 'pNInz6obpgDQGcFmaJgB',      // Deep, clear male voice
  antoni: 'ErXwobaYiN019PkySvjV',    // Well-rounded male voice
  rachel: '21m00Tcm4TlvDq8ikWAM',    // Calm female voice
  domi: 'AZnzlk1XvdvUeBnXmlld',      // Strong female voice
  bella: 'EXAVITQu4vr4xnSDxMaL',     // Soft female voice
  josh: 'TxGEqnHWrfWFTfGW9XjX',      // Deep male voice
} as const;

export type ElevenLabsVoice = keyof typeof ELEVENLABS_VOICES;

interface ElevenLabsVoiceSettings {
  stability: number;
  similarity_boost: number;
}

/**
 * ElevenLabs TTS Provider
 */
export class ElevenLabsTTSProvider implements TTSProvider {
  readonly name: TTSProviderName = 'elevenlabs' as TTSProviderName;
  readonly defaultVoice: string = 'adam';
  readonly defaultModel: string = 'eleven_monolingual_v1';

  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate speech from text and save to file
   */
  async generate(
    text: string,
    outputPath: string,
    options: TTSOptions = {}
  ): Promise<TTSResult> {
    const voiceName = options.voice || this.defaultVoice;
    const voiceId = ELEVENLABS_VOICES[voiceName as ElevenLabsVoice] || voiceName;

    // Ensure output directory exists
    const dir = dirname(outputPath);
    await mkdir(dir, { recursive: true });

    try {
      logger.debug(`Generating audio with ElevenLabs: "${text}"`);
      logger.debug(`Voice: ${voiceName} (${voiceId})`);

      const voiceSettings: ElevenLabsVoiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
      };

      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          body: JSON.stringify({
            text,
            model_id: options.model || this.defaultModel,
            voice_settings: voiceSettings,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      await writeFile(outputPath, Buffer.from(audioBuffer));

      // Get file stats
      const stats = await stat(outputPath);

      logger.debug(`Audio saved to ${outputPath} (${stats.size} bytes)`);

      return {
        outputPath,
        size: stats.size,
        provider: this.name,
        voice: voiceName,
        model: options.model || this.defaultModel,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ProviderError(
        `ElevenLabs API error: ${message}`,
        this.name,
        message.includes('401') || message.includes('invalid_api_key')
          ? 'Check your ElevenLabs API key.'
          : undefined
      );
    }
  }

  /**
   * Check if the provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get available voices
   */
  getVoices(): string[] {
    return Object.keys(ELEVENLABS_VOICES);
  }
}

/**
 * Create an ElevenLabs TTS provider
 */
export function createElevenLabsTTS(apiKey: string): ElevenLabsTTSProvider {
  return new ElevenLabsTTSProvider(apiKey);
}
