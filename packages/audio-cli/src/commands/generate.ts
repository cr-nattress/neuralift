import { Command } from 'commander';
import ora from 'ora';
import { logger } from '../utils/logger.js';
import { withErrorHandling, ConfigError } from '../utils/errors.js';
import { loadConfig } from '../utils/config.js';
import { createAudioGenerator, createGCPStorage } from '../services/index.js';
import { TRAINING_LETTERS, type TrainingLetter } from '../types/index.js';
import type { TTSOptions } from '../types/tts.js';

interface LetterOptions {
  provider?: string;
  voice?: string;
  model?: string;
  output?: string;
}

interface LettersOptions {
  provider?: string;
  voice?: string;
  model?: string;
  output?: string;
}

interface FeedbackOptions {
  provider?: string;
  voice?: string;
  model?: string;
  output?: string;
}

interface AllOptions {
  provider?: string;
  voice?: string;
  model?: string;
  output?: string;
  upload?: boolean;
  dryRun?: boolean;
}

/**
 * Generate a single letter audio file
 */
async function generateLetter(
  letter: string,
  options: LetterOptions
): Promise<void> {
  const config = loadConfig();
  const upperLetter = letter.toUpperCase() as TrainingLetter;

  if (!TRAINING_LETTERS.includes(upperLetter)) {
    throw new ConfigError(
      `Invalid letter: ${letter}`,
      `Valid letters: ${TRAINING_LETTERS.join(', ')}`
    );
  }

  if (!config.openaiApiKey) {
    throw new ConfigError(
      'OpenAI API key is required for audio generation',
      'Set OPENAI_API_KEY environment variable'
    );
  }

  const spinner = ora(`Generating audio for letter "${upperLetter}"...`).start();

  try {
    const generator = createAudioGenerator();
    const ttsOptions: TTSOptions = {
      voice: options.voice,
      model: options.model,
    };

    const result = await generator.generateLetter(upperLetter, ttsOptions);

    spinner.succeed(`Generated audio for letter "${upperLetter}"`);
    logger.keyValue('Voice', result.voice);
    logger.keyValue('Model', result.model);
    logger.keyValue('Size', `${(result.size / 1024).toFixed(1)} KB`);
    logger.keyValue('Output', result.outputPath);
  } catch (error) {
    spinner.fail(`Failed to generate audio for letter "${upperLetter}"`);
    throw error;
  }
}

/**
 * Generate all letter audio files
 */
async function generateLetters(options: LettersOptions): Promise<void> {
  const config = loadConfig();

  if (!config.openaiApiKey) {
    throw new ConfigError(
      'OpenAI API key is required for audio generation',
      'Set OPENAI_API_KEY environment variable'
    );
  }

  logger.section('Generating Letter Audio Files');
  logger.keyValue('Letters', TRAINING_LETTERS.join(', '));
  logger.keyValue('Voice', options.voice || 'onyx (default)');
  logger.keyValue('Output Directory', options.output || config.outputDir);
  logger.newline();

  const spinner = ora('Generating letter audio files...').start();

  try {
    const generator = createAudioGenerator();
    const ttsOptions: TTSOptions = {
      voice: options.voice,
      model: options.model,
    };

    const results = await generator.generateAllLetters(
      ttsOptions,
      (letter, current, total) => {
        spinner.text = `Generating letter "${letter}" (${current}/${total})...`;
      }
    );

    spinner.succeed(`Generated ${results.length} letter audio files`);

    // Show summary
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    logger.keyValue('Total Size', `${(totalSize / 1024).toFixed(1)} KB`);
    logger.keyValue('Files', results.map((r) => r.outputPath.split(/[/\\]/).pop()).join(', '));
  } catch (error) {
    spinner.fail('Failed to generate letter audio files');
    throw error;
  }
}

/**
 * Generate feedback sound files
 */
async function generateFeedback(options: FeedbackOptions): Promise<void> {
  const config = loadConfig();
  const feedbackTypes = ['correct', 'incorrect', 'tick', 'complete'];

  if (!config.openaiApiKey) {
    throw new ConfigError(
      'OpenAI API key is required for audio generation',
      'Set OPENAI_API_KEY environment variable'
    );
  }

  logger.section('Generating Feedback Audio Files');
  logger.keyValue('Types', feedbackTypes.join(', '));
  logger.keyValue('Voice', options.voice || 'nova (default)');
  logger.keyValue('Output Directory', options.output || config.outputDir);
  logger.newline();

  const spinner = ora('Generating feedback audio files...').start();

  try {
    const generator = createAudioGenerator();
    const ttsOptions: TTSOptions = {
      voice: options.voice,
      model: options.model,
    };

    const results = await generator.generateAllFeedback(
      ttsOptions,
      (type, current, total) => {
        spinner.text = `Generating "${type}" (${current}/${total})...`;
      }
    );

    spinner.succeed(`Generated ${results.length} feedback audio files`);

    // Show summary
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    logger.keyValue('Total Size', `${(totalSize / 1024).toFixed(1)} KB`);
    logger.keyValue('Files', results.map((r) => r.outputPath.split(/[/\\]/).pop()).join(', '));
  } catch (error) {
    spinner.fail('Failed to generate feedback audio files');
    throw error;
  }
}

/**
 * Generate all audio files (letters + feedback)
 */
async function generateAll(options: AllOptions): Promise<void> {
  const config = loadConfig();

  if (!config.openaiApiKey) {
    throw new ConfigError(
      'OpenAI API key is required for audio generation',
      'Set OPENAI_API_KEY environment variable'
    );
  }

  logger.section('Generate All Audio Files');
  logger.keyValue('Letters', TRAINING_LETTERS.join(', '));
  logger.keyValue('Feedback', 'correct, incorrect, tick, complete');
  logger.keyValue('Voice', options.voice || 'default (onyx/nova)');
  logger.keyValue('Output Directory', options.output || config.outputDir);

  if (options.upload) {
    logger.keyValue('Auto-upload', 'Enabled');
  }

  if (options.dryRun) {
    logger.keyValue('Dry Run', 'Yes - no files will be generated');
  }

  logger.newline();

  if (options.dryRun) {
    logger.info('Would generate:');
    TRAINING_LETTERS.forEach((letter) => {
      logger.log(`  - letters/${letter.toLowerCase()}.mp3`);
    });
    ['correct', 'incorrect', 'tick', 'complete'].forEach((type) => {
      logger.log(`  - feedback/${type}.mp3`);
    });
    logger.newline();
    logger.warn('Dry run complete - no files generated');
    return;
  }

  const startTime = Date.now();
  const generator = createAudioGenerator();
  const ttsOptions: TTSOptions = {
    voice: options.voice,
    model: options.model,
  };

  const results: { file: string; success: boolean; error?: string }[] = [];

  // Generate letters
  const letterSpinner = ora('Generating letter audio files...').start();

  try {
    const letterResults = await generator.generateAllLetters(
      ttsOptions,
      (letter, current, total) => {
        letterSpinner.text = `Generating letter "${letter}" (${current}/${total})...`;
      }
    );

    letterSpinner.succeed(`Generated ${letterResults.length} letter files`);
    letterResults.forEach((r) => {
      results.push({ file: r.outputPath, success: true });
    });
  } catch (error) {
    letterSpinner.fail('Failed to generate some letter files');
    const message = error instanceof Error ? error.message : String(error);
    results.push({ file: 'letters', success: false, error: message });
  }

  // Generate feedback
  const feedbackSpinner = ora('Generating feedback audio files...').start();

  try {
    const feedbackResults = await generator.generateAllFeedback(
      ttsOptions,
      (type, current, total) => {
        feedbackSpinner.text = `Generating "${type}" (${current}/${total})...`;
      }
    );

    feedbackSpinner.succeed(`Generated ${feedbackResults.length} feedback files`);
    feedbackResults.forEach((r) => {
      results.push({ file: r.outputPath, success: true });
    });
  } catch (error) {
    feedbackSpinner.fail('Failed to generate some feedback files');
    const message = error instanceof Error ? error.message : String(error);
    results.push({ file: 'feedback', success: false, error: message });
  }

  // Calculate summary
  const elapsed = (Date.now() - startTime) / 1000;
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  logger.newline();
  logger.section('Summary');
  logger.keyValue('Successful', successful.toString());
  logger.keyValue('Failed', failed.toString());
  logger.keyValue('Time', `${elapsed.toFixed(1)}s`);

  // Upload if requested
  if (options.upload && failed === 0) {
    const uploadSpinner = ora('Uploading to GCP Storage...').start();

    try {
      if (!config.gcpBucketName) {
        throw new ConfigError(
          'GCP bucket is not configured',
          'Set GCP_BUCKET_NAME environment variable'
        );
      }

      const storage = createGCPStorage({
        bucketName: config.gcpBucketName,
        projectId: config.gcpProjectId,
        keyFilename: config.gcpKeyFile,
      });

      const successfulFiles = results
        .filter((r) => r.success)
        .map((r) => {
          const parts = r.file.split(/[/\\]/);
          const filename = parts.pop() || '';
          const folder = parts.pop() || '';
          return {
            localPath: r.file,
            remotePath: `${folder}/${filename}`,
          };
        });

      const syncResult = await storage.syncToRemote(
        successfulFiles,
        true,
        (file, current, total) => {
          uploadSpinner.text = `Uploading ${file} (${current}/${total})...`;
        }
      );

      uploadSpinner.succeed(`Uploaded ${syncResult.uploaded.length} files to GCP`);
      logger.keyValue('Bucket', config.gcpBucketName);
    } catch (error) {
      uploadSpinner.fail('Upload failed');
      const message = error instanceof Error ? error.message : String(error);
      logger.error(message);
    }
  } else if (options.upload && failed > 0) {
    logger.warn('Skipping upload due to generation failures');
  }

  if (failed > 0) {
    logger.newline();
    logger.warn('Failed files:');
    results.filter((r) => !r.success).forEach((r) => {
      logger.log(`  - ${r.file}: ${r.error}`);
    });
  } else {
    logger.newline();
    logger.success('All audio files generated successfully');
  }
}

/**
 * Create the generate command
 */
export function createGenerateCommand(): Command {
  const generate = new Command('generate')
    .description('Generate audio files for training');

  generate
    .command('letter <letter>')
    .description('Generate audio for a single letter (C, H, K, L, Q, R, S, T)')
    .option('-p, --provider <provider>', 'TTS provider (openai, google)')
    .option('-v, --voice <voice>', 'Voice to use (alloy, echo, fable, onyx, nova, shimmer)')
    .option('-m, --model <model>', 'TTS model (tts-1, tts-1-hd)')
    .option('-o, --output <path>', 'Output file path')
    .action(withErrorHandling(generateLetter));

  generate
    .command('letters')
    .description('Generate audio for all training letters')
    .option('-p, --provider <provider>', 'TTS provider (openai, google)')
    .option('-v, --voice <voice>', 'Voice to use (alloy, echo, fable, onyx, nova, shimmer)')
    .option('-m, --model <model>', 'TTS model (tts-1, tts-1-hd)')
    .option('-o, --output <dir>', 'Output directory')
    .action(withErrorHandling(generateLetters));

  generate
    .command('feedback')
    .description('Generate feedback sound files (correct, incorrect, tick, complete)')
    .option('-p, --provider <provider>', 'TTS provider (openai, google)')
    .option('-v, --voice <voice>', 'Voice to use (alloy, echo, fable, onyx, nova, shimmer)')
    .option('-m, --model <model>', 'TTS model (tts-1, tts-1-hd)')
    .option('-o, --output <dir>', 'Output directory')
    .action(withErrorHandling(generateFeedback));

  generate
    .command('all')
    .description('Generate all audio files (letters + feedback)')
    .option('-p, --provider <provider>', 'TTS provider (openai, google)')
    .option('-v, --voice <voice>', 'Voice to use (alloy, echo, fable, onyx, nova, shimmer)')
    .option('-m, --model <model>', 'TTS model (tts-1, tts-1-hd)')
    .option('-o, --output <dir>', 'Output directory')
    .option('--upload', 'Upload to GCP Storage after generation')
    .option('--dry-run', 'Show what would be generated without generating')
    .action(withErrorHandling(generateAll));

  return generate;
}
