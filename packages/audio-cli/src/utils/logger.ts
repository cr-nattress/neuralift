import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

let verboseMode = false;

export function setVerbose(verbose: boolean): void {
  verboseMode = verbose;
}

export function isVerbose(): boolean {
  return verboseMode;
}

export const logger = {
  debug(message: string, ...args: unknown[]): void {
    if (verboseMode) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    console.log(chalk.blue('ℹ'), message, ...args);
  },

  warn(message: string, ...args: unknown[]): void {
    console.log(chalk.yellow('⚠'), chalk.yellow(message), ...args);
  },

  error(message: string, ...args: unknown[]): void {
    console.error(chalk.red('✖'), chalk.red(message), ...args);
  },

  success(message: string, ...args: unknown[]): void {
    console.log(chalk.green('✔'), chalk.green(message), ...args);
  },

  // Plain output without prefix
  log(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  },

  // Styled output helpers
  bold(message: string): string {
    return chalk.bold(message);
  },

  dim(message: string): string {
    return chalk.dim(message);
  },

  highlight(message: string): string {
    return chalk.cyan(message);
  },

  // Table-like output
  keyValue(key: string, value: string): void {
    console.log(`  ${chalk.dim(key + ':')} ${value}`);
  },

  // Section headers
  section(title: string): void {
    console.log();
    console.log(chalk.bold.underline(title));
  },

  // Newline
  newline(): void {
    console.log();
  },
};

export default logger;
