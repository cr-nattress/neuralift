import { Command } from 'commander';
import ora from 'ora';
import { glob } from 'glob';
import { join } from 'path';
import { logger } from '../utils/logger.js';
import { withErrorHandling, AudioError } from '../utils/errors.js';
import { loadConfig } from '../utils/config.js';
import {
  createAudioAnalyzer,
  createGCPStorage,
  AudioAnalyzer,
} from '../services/index.js';

interface AnalyzeOptions {
  verbose?: boolean;
  json?: boolean;
}

interface ValidateOptions {
  output?: string;
  json?: boolean;
}

/**
 * Analyze a single audio file
 */
async function analyzeFile(
  file: string,
  options: AnalyzeOptions
): Promise<void> {
  const spinner = ora(`Analyzing ${file}...`).start();
  const analyzer = createAudioAnalyzer();

  // Check if ffmpeg is available
  const available = await analyzer.isAvailable();
  if (!available) {
    spinner.fail('ffmpeg is not installed');
    throw new AudioError(
      'ffmpeg/ffprobe is required for audio analysis',
      'Install ffmpeg: https://ffmpeg.org/download.html'
    );
  }

  try {
    const metadata = await analyzer.analyze(file);
    const requirements = AudioAnalyzer.getRequirementsForFile(metadata.filename);
    const result = analyzer.validate(metadata, requirements);

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify({ metadata, validation: result }, null, 2));
      return;
    }

    logger.section(`Analysis: ${metadata.filename}`);
    logger.keyValue('Format', metadata.format.toUpperCase());
    logger.keyValue('Duration', `${metadata.duration.toFixed(2)}s`);
    logger.keyValue('Sample Rate', `${metadata.sampleRate} Hz`);
    logger.keyValue('Bit Rate', `${(metadata.bitRate / 1000).toFixed(0)} kbps`);
    logger.keyValue('Channels', metadata.channels === 1 ? 'Mono' : 'Stereo');
    logger.keyValue('Codec', metadata.codec);
    logger.keyValue('Size', `${(metadata.fileSize / 1024).toFixed(1)} KB`);

    logger.newline();

    if (result.isValid && result.issues.length === 0) {
      logger.success('File meets all requirements');
    } else if (result.isValid) {
      logger.success('File passes validation');
      if (options.verbose && result.issues.length > 0) {
        logger.warn('Warnings:');
        result.issues.forEach((issue) => {
          logger.log(`  ℹ ${issue.property}: expected ${issue.expected}, got ${issue.actual}`);
        });
      }
    } else {
      logger.error('File fails validation');
      result.issues.forEach((issue) => {
        const icon = issue.severity === 'error' ? '  ⚠' : '  ℹ';
        logger.log(`${icon} ${issue.property}: expected ${issue.expected}, got ${issue.actual}`);
      });
    }
  } catch (error) {
    spinner.fail(`Failed to analyze ${file}`);
    throw error;
  }
}

/**
 * Analyze all files in the bucket
 */
async function analyzeBucket(options: AnalyzeOptions): Promise<void> {
  const config = loadConfig();

  if (!config.gcpBucketName) {
    throw new AudioError(
      'GCP bucket is not configured',
      'Set GCP_BUCKET_NAME environment variable'
    );
  }

  logger.section('Bucket Analysis');
  logger.keyValue('Bucket', config.gcpBucketName);
  logger.newline();

  const spinner = ora('Connecting to bucket...').start();

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    const available = await storage.isAvailable();
    if (!available) {
      spinner.fail('Cannot connect to bucket');
      throw new AudioError(
        `Bucket "${config.gcpBucketName}" not found or not accessible`,
        'Check your GCP credentials and bucket name'
      );
    }

    spinner.text = 'Fetching file list...';
    const files = await storage.listFiles();

    const audioFiles = files.filter(f =>
      f.name.endsWith('.mp3') || f.name.endsWith('.wav') || f.name.endsWith('.ogg')
    );

    spinner.stop();

    // Categorize files
    const letterFiles = audioFiles.filter(f => f.name.includes('letters/'));
    const feedbackFiles = audioFiles.filter(f => f.name.includes('feedback/'));
    const otherFiles = audioFiles.filter(f => !f.name.includes('letters/') && !f.name.includes('feedback/'));

    const totalSize = audioFiles.reduce((sum, f) => sum + f.size, 0);

    if (options.json) {
      console.log(JSON.stringify({
        bucket: config.gcpBucketName,
        totalFiles: audioFiles.length,
        totalSize,
        letterFiles: letterFiles.length,
        feedbackFiles: feedbackFiles.length,
        otherFiles: otherFiles.length,
        files: audioFiles,
      }, null, 2));
      return;
    }

    logger.info('Summary:');
    logger.keyValue('Total Audio Files', audioFiles.length.toString());
    logger.keyValue('Total Size', `${(totalSize / 1024).toFixed(1)} KB`);
    logger.keyValue('Letter Files', letterFiles.length.toString());
    logger.keyValue('Feedback Files', feedbackFiles.length.toString());
    if (otherFiles.length > 0) {
      logger.keyValue('Other Files', otherFiles.length.toString());
    }

    if (options.verbose) {
      logger.newline();
      logger.info('Files:');
      for (const file of audioFiles) {
        const updated = file.updated ? new Date(file.updated).toLocaleDateString() : 'Unknown';
        logger.log(`  ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${updated})`);
      }
    }
  } catch (error) {
    spinner.fail('Failed to analyze bucket');
    throw error;
  }
}

/**
 * Validate audio files against requirements
 */
async function validateFiles(options: ValidateOptions): Promise<void> {
  const config = loadConfig();
  const outputDir = options.output || config.outputDir;

  logger.section('Audio Validation');
  logger.keyValue('Directory', outputDir);
  logger.newline();

  const spinner = ora('Scanning for audio files...').start();
  const analyzer = createAudioAnalyzer();

  // Check if ffmpeg is available
  const available = await analyzer.isAvailable();
  if (!available) {
    spinner.fail('ffmpeg is not installed');
    throw new AudioError(
      'ffmpeg/ffprobe is required for audio validation',
      'Install ffmpeg: https://ffmpeg.org/download.html'
    );
  }

  try {
    // Find all audio files
    const pattern = join(outputDir, '**/*.mp3');
    const files = await glob(pattern, { windowsPathsNoEscape: true });

    if (files.length === 0) {
      spinner.stop();
      logger.warn(`No audio files found in ${outputDir}`);
      return;
    }

    spinner.text = `Validating ${files.length} files...`;

    const report = await analyzer.analyzeMultiple(
      files,
      (filename) => AudioAnalyzer.getRequirementsForFile(filename),
      (file, current, total) => {
        spinner.text = `Validating ${file} (${current}/${total})...`;
      }
    );

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    logger.info('Validation Results:');
    logger.keyValue('Total Files', report.totalFiles.toString());
    logger.keyValue('Valid', report.validFiles.toString());
    logger.keyValue('Invalid', report.invalidFiles.toString());

    if (report.invalidFiles > 0) {
      logger.newline();
      logger.warn('Files with issues:');
      for (const result of report.results) {
        if (!result.isValid || result.issues.length > 0) {
          console.log(analyzer.formatValidation(result));
        }
      }
    } else {
      logger.newline();
      logger.success('All files pass validation');
    }
  } catch (error) {
    spinner.fail('Validation failed');
    throw error;
  }
}

/**
 * Create the analyze command
 */
export function createAnalyzeCommand(): Command {
  const analyze = new Command('analyze')
    .description('Analyze audio files and validate requirements');

  analyze
    .command('file <file>')
    .description('Analyze a single audio file')
    .option('-v, --verbose', 'Show detailed analysis')
    .option('--json', 'Output in JSON format')
    .action(withErrorHandling(analyzeFile));

  analyze
    .command('bucket')
    .description('Analyze all files in the storage bucket')
    .option('-v, --verbose', 'Show detailed analysis for each file')
    .option('--json', 'Output in JSON format')
    .action(withErrorHandling(analyzeBucket));

  analyze
    .command('validate')
    .description('Validate audio files meet requirements')
    .option('-o, --output <dir>', 'Directory to validate')
    .option('--json', 'Output in JSON format')
    .action(withErrorHandling(validateFiles));

  return analyze;
}
