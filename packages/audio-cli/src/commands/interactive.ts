import { Command } from 'commander';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';
import { withErrorHandling } from '../utils/errors.js';
import { loadConfig, printConfig } from '../utils/config.js';
import { createAudioGenerator, createGCPStorage, createAudioAnalyzer } from '../services/index.js';
import { TRAINING_LETTERS, type TrainingLetter } from '../types/index.js';
import type { TTSOptions } from '../types/tts.js';

const VERSION = '1.0.0';

/**
 * Display the CLI banner
 */
function displayBanner(): void {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log(`║     Neuralift Audio CLI v${VERSION}           ║`);
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
}

/**
 * Main menu choices
 */
const MAIN_MENU_CHOICES = [
  { name: 'Generate Audio Files', value: 'generate' },
  { name: 'Manage Storage', value: 'storage' },
  { name: 'Analyze Audio', value: 'analyze' },
  { name: 'View Configuration', value: 'config' },
  { name: 'Help', value: 'help' },
  new inquirer.Separator(),
  { name: 'Exit', value: 'exit' },
];

/**
 * Handle the generate submenu
 */
async function handleGenerate(): Promise<void> {
  const config = loadConfig();

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What would you like to generate?',
      choices: [
        { name: 'Single Letter', value: 'letter' },
        { name: 'All Letters (C, H, K, L, Q, R, S, T)', value: 'letters' },
        { name: 'Feedback Sounds', value: 'feedback' },
        { name: 'Everything', value: 'all' },
        new inquirer.Separator(),
        { name: 'Back to Main Menu', value: 'back' },
      ],
    },
  ]);

  if (type === 'back') return;

  if (!config.openaiApiKey) {
    logger.error('OpenAI API key is not configured');
    logger.info('Set OPENAI_API_KEY environment variable and restart');
    await pressEnterToContinue();
    return;
  }

  const generator = createAudioGenerator();
  const ttsOptions: TTSOptions = {};

  try {
    if (type === 'letter') {
      const { letter } = await inquirer.prompt([
        {
          type: 'list',
          name: 'letter',
          message: 'Which letter?',
          choices: TRAINING_LETTERS.map((l) => ({ name: l, value: l })),
        },
      ]);

      logger.info(`Generating audio for letter "${letter}"...`);
      const result = await generator.generateLetter(letter as TrainingLetter, ttsOptions);
      logger.success(`Generated: ${result.outputPath}`);
      logger.keyValue('Size', `${(result.size / 1024).toFixed(1)} KB`);
    } else if (type === 'letters') {
      logger.info('Generating all letter audio files...');
      const results = await generator.generateAllLetters(ttsOptions, (letter, current, total) => {
        process.stdout.write(`\rGenerating letter "${letter}" (${current}/${total})...`);
      });
      console.log('');
      logger.success(`Generated ${results.length} letter files`);
    } else if (type === 'feedback') {
      logger.info('Generating feedback audio files...');
      const results = await generator.generateAllFeedback(ttsOptions, (feedbackType, current, total) => {
        process.stdout.write(`\rGenerating "${feedbackType}" (${current}/${total})...`);
      });
      console.log('');
      logger.success(`Generated ${results.length} feedback files`);
    } else if (type === 'all') {
      logger.info('Generating all audio files...');

      const letterResults = await generator.generateAllLetters(ttsOptions, (letter, current, total) => {
        process.stdout.write(`\rGenerating letter "${letter}" (${current}/${total})...`);
      });
      console.log('');

      const feedbackResults = await generator.generateAllFeedback(ttsOptions, (feedbackType, current, total) => {
        process.stdout.write(`\rGenerating "${feedbackType}" (${current}/${total})...`);
      });
      console.log('');

      logger.success(`Generated ${letterResults.length + feedbackResults.length} total files`);

      // Ask about upload
      if (config.gcpBucketName) {
        const { upload } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'upload',
            message: 'Would you like to upload to GCP Storage?',
            default: false,
          },
        ]);

        if (upload) {
          try {
            const storage = createGCPStorage({
              bucketName: config.gcpBucketName,
              projectId: config.gcpProjectId,
              keyFilename: config.gcpKeyFile,
            });

            const allResults = [...letterResults, ...feedbackResults];
            const filesToUpload = allResults.map((r) => {
              const parts = r.outputPath.split(/[/\\]/);
              const filename = parts.pop() || '';
              const folder = parts.pop() || '';
              return {
                localPath: r.outputPath,
                remotePath: `${folder}/${filename}`,
              };
            });

            logger.info('Uploading files...');
            const syncResult = await storage.syncToRemote(filesToUpload, true, (file, current, total) => {
              process.stdout.write(`\rUploading ${file} (${current}/${total})...`);
            });
            console.log('');
            logger.success(`Uploaded ${syncResult.uploaded.length} files`);
          } catch (error) {
            logger.error('Upload failed');
          }
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Generation failed: ${message}`);
  }

  await pressEnterToContinue();
}

/**
 * Handle the storage submenu
 */
async function handleStorage(): Promise<void> {
  const config = loadConfig();

  if (!config.gcpBucketName) {
    logger.error('GCP Storage is not configured');
    logger.info('Set GCP_BUCKET_NAME environment variable and restart');
    await pressEnterToContinue();
    return;
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Storage Operations:',
      choices: [
        { name: 'List Files', value: 'list' },
        { name: 'Sync Local to Cloud', value: 'sync-up' },
        { name: 'Sync Cloud to Local', value: 'sync-down' },
        new inquirer.Separator(),
        { name: 'Back to Main Menu', value: 'back' },
      ],
    },
  ]);

  if (action === 'back') return;

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    if (action === 'list') {
      logger.info('Fetching file list...');
      const files = await storage.listFiles();

      if (files.length === 0) {
        logger.warn('No files found in bucket');
      } else {
        logger.section(`Files in ${config.gcpBucketName}`);
        files.forEach((file) => {
          const size = `${(file.size / 1024).toFixed(1)} KB`;
          logger.log(`  ${file.name.padEnd(30)} ${size}`);
        });
        logger.newline();
        logger.info(`Total: ${files.length} files`);
      }
    } else if (action === 'sync-up' || action === 'sync-down') {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Sync ${action === 'sync-up' ? 'local files to cloud' : 'cloud files to local'}?`,
          default: true,
        },
      ]);

      if (confirm) {
        logger.info('Syncing...');
        logger.warn('Use CLI command for full sync: neuralift-audio storage sync');
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Storage operation failed: ${message}`);
  }

  await pressEnterToContinue();
}

/**
 * Handle the analyze submenu
 */
async function handleAnalyze(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Analysis Operations:',
      choices: [
        { name: 'Validate Local Files', value: 'validate' },
        { name: 'Check ffmpeg Installation', value: 'check-ffmpeg' },
        new inquirer.Separator(),
        { name: 'Back to Main Menu', value: 'back' },
      ],
    },
  ]);

  if (action === 'back') return;

  try {
    const analyzer = createAudioAnalyzer();

    if (action === 'check-ffmpeg') {
      logger.info('Checking ffmpeg installation...');
      const available = await analyzer.isAvailable();

      if (available) {
        logger.success('ffmpeg is installed and available');
      } else {
        logger.error('ffmpeg is not installed or not in PATH');
        logger.info('Install from: https://ffmpeg.org/download.html');
      }
    } else if (action === 'validate') {
      const available = await analyzer.isAvailable();
      if (!available) {
        logger.error('ffmpeg is required for validation');
        logger.info('Install from: https://ffmpeg.org/download.html');
      } else {
        logger.warn('Use CLI command for validation: neuralift-audio analyze validate');
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Analysis failed: ${message}`);
  }

  await pressEnterToContinue();
}

/**
 * Show configuration
 */
async function handleConfig(): Promise<void> {
  const config = loadConfig();
  printConfig(config);
  await pressEnterToContinue();
}

/**
 * Show help
 */
async function handleHelp(): Promise<void> {
  console.log('');
  logger.section('Neuralift Audio CLI Help');
  console.log('');
  logger.info('Available Commands:');
  console.log('');
  logger.log('  generate letter <letter>   Generate a single letter audio');
  logger.log('  generate letters           Generate all letter audio files');
  logger.log('  generate feedback          Generate feedback sound files');
  logger.log('  generate all               Generate all audio files');
  console.log('');
  logger.log('  storage list               List files in GCP bucket');
  logger.log('  storage upload <file>      Upload a file to bucket');
  logger.log('  storage download <file>    Download a file from bucket');
  logger.log('  storage sync               Sync local and cloud files');
  console.log('');
  logger.log('  analyze file <file>        Analyze an audio file');
  logger.log('  analyze validate           Validate all audio files');
  console.log('');
  logger.info('Environment Variables:');
  console.log('');
  logger.log('  OPENAI_API_KEY             OpenAI API key (required for generation)');
  logger.log('  GCP_BUCKET_NAME            GCP Storage bucket name');
  logger.log('  GCP_PROJECT_ID             GCP project ID');
  logger.log('  GCP_KEY_FILE               Path to GCP service account key');
  logger.log('  OUTPUT_DIR                 Local output directory');
  console.log('');
  await pressEnterToContinue();
}

/**
 * Wait for user to press Enter
 */
async function pressEnterToContinue(): Promise<void> {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press Enter to continue...',
    },
  ]);
}

/**
 * Handle an action from the main menu
 */
async function handleAction(action: string): Promise<void> {
  console.clear();

  switch (action) {
    case 'generate':
      await handleGenerate();
      break;
    case 'storage':
      await handleStorage();
      break;
    case 'analyze':
      await handleAnalyze();
      break;
    case 'config':
      await handleConfig();
      break;
    case 'help':
      await handleHelp();
      break;
  }
}

/**
 * Run interactive mode
 */
async function runInteractive(): Promise<void> {
  console.clear();
  displayBanner();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: MAIN_MENU_CHOICES,
      },
    ]);

    if (action === 'exit') {
      console.log('');
      logger.info('Goodbye!');
      console.log('');
      break;
    }

    await handleAction(action);
    console.clear();
    displayBanner();
  }
}

/**
 * Create the interactive command
 */
export function createInteractiveCommand(): Command {
  const interactive = new Command('interactive')
    .alias('i')
    .description('Start interactive mode with menu-driven interface')
    .action(withErrorHandling(runInteractive));

  return interactive;
}
