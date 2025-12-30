import { Command } from 'commander';
import { logger, setVerbose } from './utils/logger.js';
import { loadConfig, printConfig } from './utils/config.js';
import {
  createGenerateCommand,
  createStorageCommand,
  createAnalyzeCommand,
  createInteractiveCommand,
} from './commands/index.js';

// Read package version
const VERSION = '0.1.0';

/**
 * Create and configure the CLI program
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('neuralift-audio')
    .description('CLI tool for generating and managing Neuralift training audio files')
    .version(VERSION, '-v, --version', 'Display version number')
    .option('--verbose', 'Enable verbose output')
    .hook('preAction', (thisCommand) => {
      const opts = thisCommand.opts();
      if (opts.verbose) {
        setVerbose(true);
        logger.debug('Verbose mode enabled');
      }
    });

  // Add subcommands
  program.addCommand(createGenerateCommand());
  program.addCommand(createStorageCommand());
  program.addCommand(createAnalyzeCommand());
  program.addCommand(createInteractiveCommand());

  // Config command - show current configuration
  program
    .command('config')
    .description('Display current configuration')
    .action(() => {
      const config = loadConfig();
      printConfig(config);
    });

  // Add helpful error handling for unknown commands
  program.showHelpAfterError(true);
  program.showSuggestionAfterError(true);

  return program;
}

/**
 * Run the CLI
 */
export async function run(args: string[] = process.argv): Promise<void> {
  const program = createProgram();

  try {
    await program.parseAsync(args);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}
