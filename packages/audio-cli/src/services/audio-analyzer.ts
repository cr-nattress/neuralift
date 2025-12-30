import ffmpeg from 'fluent-ffmpeg';
import { stat } from 'fs/promises';
import { basename } from 'path';
import { logger } from '../utils/logger.js';
import { AudioError } from '../utils/errors.js';

export interface AudioMetadata {
  filename: string;
  filePath: string;
  duration: number;
  sampleRate: number;
  bitRate: number;
  channels: number;
  format: string;
  codec: string;
  fileSize: number;
}

export interface AudioRequirements {
  minDuration: number;
  maxDuration: number;
  sampleRate: number;
  minBitRate: number;
  channels?: number;
}

export interface ValidationIssue {
  property: string;
  expected: string;
  actual: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  filename: string;
  isValid: boolean;
  issues: ValidationIssue[];
  metadata: AudioMetadata;
}

export interface AnalysisReport {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  results: ValidationResult[];
}

// Audio requirements for different file types
export const LETTER_REQUIREMENTS: AudioRequirements = {
  minDuration: 0.5,
  maxDuration: 1.5,
  sampleRate: 44100,
  minBitRate: 128000,
};

export const FEEDBACK_REQUIREMENTS: AudioRequirements = {
  minDuration: 0.05,
  maxDuration: 0.5,
  sampleRate: 44100,
  minBitRate: 128000,
};

export const COMPLETE_REQUIREMENTS: AudioRequirements = {
  minDuration: 0.5,
  maxDuration: 1.0,
  sampleRate: 44100,
  minBitRate: 128000,
};

/**
 * Audio Analysis Service
 */
export class AudioAnalyzer {
  private ffmpegAvailable: boolean | null = null;

  /**
   * Check if ffmpeg/ffprobe is available on the system
   */
  async isAvailable(): Promise<boolean> {
    if (this.ffmpegAvailable !== null) {
      return this.ffmpegAvailable;
    }

    return new Promise((resolve) => {
      ffmpeg.getAvailableFormats((err) => {
        this.ffmpegAvailable = !err;
        resolve(!err);
      });
    });
  }

  /**
   * Analyze a single audio file
   */
  async analyze(filePath: string): Promise<AudioMetadata> {
    const available = await this.isAvailable();
    if (!available) {
      throw new AudioError(
        'ffmpeg/ffprobe is not installed or not in PATH',
        'Install ffmpeg: https://ffmpeg.org/download.html'
      );
    }

    try {
      const stats = await stat(filePath);

      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) {
            reject(new AudioError(`Failed to analyze ${filePath}: ${err.message}`));
            return;
          }

          const audioStream = metadata.streams.find(
            (s) => s.codec_type === 'audio'
          );

          if (!audioStream) {
            reject(new AudioError(`No audio stream found in ${filePath}`));
            return;
          }

          resolve({
            filename: basename(filePath),
            filePath,
            duration: metadata.format.duration || 0,
            sampleRate: parseInt(String(audioStream.sample_rate)) || 0,
            bitRate: parseInt(String(metadata.format.bit_rate)) || 0,
            channels: audioStream.channels || 0,
            format: metadata.format.format_name || '',
            codec: audioStream.codec_name || '',
            fileSize: stats.size,
          });
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new AudioError(`Failed to analyze audio: ${message}`);
    }
  }

  /**
   * Validate audio against requirements
   */
  validate(metadata: AudioMetadata, requirements: AudioRequirements): ValidationResult {
    const issues: ValidationIssue[] = [];

    // Check duration
    if (metadata.duration < requirements.minDuration) {
      issues.push({
        property: 'duration',
        expected: `>= ${requirements.minDuration}s`,
        actual: `${metadata.duration.toFixed(2)}s`,
        severity: 'error',
      });
    } else if (metadata.duration > requirements.maxDuration) {
      issues.push({
        property: 'duration',
        expected: `<= ${requirements.maxDuration}s`,
        actual: `${metadata.duration.toFixed(2)}s`,
        severity: 'error',
      });
    }

    // Check sample rate
    if (metadata.sampleRate !== requirements.sampleRate) {
      issues.push({
        property: 'sampleRate',
        expected: `${requirements.sampleRate}Hz`,
        actual: `${metadata.sampleRate}Hz`,
        severity: metadata.sampleRate < requirements.sampleRate ? 'error' : 'warning',
      });
    }

    // Check bit rate
    if (metadata.bitRate < requirements.minBitRate) {
      issues.push({
        property: 'bitRate',
        expected: `>= ${requirements.minBitRate / 1000}kbps`,
        actual: `${(metadata.bitRate / 1000).toFixed(0)}kbps`,
        severity: 'error',
      });
    }

    // Check channels if specified
    if (requirements.channels && metadata.channels !== requirements.channels) {
      issues.push({
        property: 'channels',
        expected: `${requirements.channels}`,
        actual: `${metadata.channels}`,
        severity: 'warning',
      });
    }

    return {
      filename: metadata.filename,
      isValid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
      metadata,
    };
  }

  /**
   * Analyze multiple files and generate a report
   */
  async analyzeMultiple(
    filePaths: string[],
    getRequirements: (filename: string) => AudioRequirements,
    onProgress?: (file: string, current: number, total: number) => void
  ): Promise<AnalysisReport> {
    const results: ValidationResult[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];

      if (onProgress) {
        onProgress(basename(filePath), i + 1, filePaths.length);
      }

      try {
        const metadata = await this.analyze(filePath);
        const requirements = getRequirements(metadata.filename);
        const result = this.validate(metadata, requirements);
        results.push(result);

        if (result.isValid) {
          validCount++;
        } else {
          invalidCount++;
        }
      } catch (error) {
        logger.debug(`Skipping ${filePath}: ${error}`);
      }
    }

    return {
      totalFiles: results.length,
      validFiles: validCount,
      invalidFiles: invalidCount,
      results,
    };
  }

  /**
   * Get requirements based on filename
   */
  static getRequirementsForFile(filename: string): AudioRequirements {
    const lowerName = filename.toLowerCase();

    // Feedback sounds
    if (lowerName.includes('tick')) {
      return { ...FEEDBACK_REQUIREMENTS, maxDuration: 0.1 };
    }
    if (lowerName.includes('correct') || lowerName.includes('incorrect')) {
      return FEEDBACK_REQUIREMENTS;
    }
    if (lowerName.includes('complete')) {
      return COMPLETE_REQUIREMENTS;
    }

    // Default to letter requirements
    return LETTER_REQUIREMENTS;
  }

  /**
   * Format metadata for display
   */
  formatMetadata(metadata: AudioMetadata): string {
    return [
      `File: ${metadata.filename}`,
      `Duration: ${metadata.duration.toFixed(2)}s`,
      `Sample Rate: ${metadata.sampleRate}Hz`,
      `Bit Rate: ${(metadata.bitRate / 1000).toFixed(0)}kbps`,
      `Channels: ${metadata.channels}`,
      `Format: ${metadata.format}`,
      `Codec: ${metadata.codec}`,
      `Size: ${(metadata.fileSize / 1024).toFixed(1)}KB`,
    ].join('\n');
  }

  /**
   * Format validation result for display
   */
  formatValidation(result: ValidationResult): string {
    const lines: string[] = [
      `${result.isValid ? '✓' : '✗'} ${result.filename}`,
    ];

    if (!result.isValid || result.issues.length > 0) {
      for (const issue of result.issues) {
        const icon = issue.severity === 'error' ? '  ⚠' : '  ℹ';
        lines.push(`${icon} ${issue.property}: expected ${issue.expected}, got ${issue.actual}`);
      }
    }

    return lines.join('\n');
  }
}

/**
 * Create an audio analyzer instance
 */
export function createAudioAnalyzer(): AudioAnalyzer {
  return new AudioAnalyzer();
}
