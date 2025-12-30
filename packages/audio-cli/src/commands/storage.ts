import { Command } from 'commander';
import ora from 'ora';
import { glob } from 'glob';
import { join, basename } from 'path';
import { stat } from 'fs/promises';
import { logger } from '../utils/logger.js';
import { withErrorHandling, StorageError, ConfigError } from '../utils/errors.js';
import { loadConfig, validateStorageConfig } from '../utils/config.js';
import { createGCPStorage } from '../services/index.js';

interface ListOptions {
  prefix?: string;
  limit?: string;
  json?: boolean;
}

interface UploadOptions {
  destination?: string;
  overwrite?: boolean;
}

interface DownloadOptions {
  output?: string;
  overwrite?: boolean;
}

interface SyncOptions {
  direction?: 'up' | 'down';
  dryRun?: boolean;
  overwrite?: boolean;
}

interface DeleteOptions {
  force?: boolean;
}

/**
 * List files in the storage bucket
 */
async function listFiles(options: ListOptions): Promise<void> {
  const config = loadConfig();
  validateStorageConfig(config);

  const spinner = ora('Connecting to bucket...').start();

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName!,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    const available = await storage.isAvailable();
    if (!available) {
      spinner.fail('Cannot connect to bucket');
      throw new StorageError(
        `Bucket "${config.gcpBucketName}" not found or not accessible`,
        'list',
        config.gcpBucketName
      );
    }

    spinner.text = 'Fetching file list...';
    const files = await storage.listFiles(options.prefix);

    spinner.stop();

    // Apply limit if specified
    const limit = options.limit ? parseInt(options.limit) : undefined;
    const displayFiles = limit ? files.slice(0, limit) : files;

    if (options.json) {
      console.log(JSON.stringify(displayFiles, null, 2));
      return;
    }

    logger.section(`Files in ${config.gcpBucketName}`);

    if (displayFiles.length === 0) {
      logger.warn('No files found');
      return;
    }

    displayFiles.forEach((file) => {
      const size = `${(file.size / 1024).toFixed(1)} KB`;
      const updated = file.updated ? new Date(file.updated).toLocaleDateString() : 'Unknown';
      logger.log(`  ${file.name.padEnd(30)} ${size.padEnd(12)} ${updated}`);
    });

    logger.newline();
    logger.info(`Total: ${files.length} files`);
    if (limit && files.length > limit) {
      logger.info(`(Showing ${limit} of ${files.length} files)`);
    }
  } catch (error) {
    spinner.fail('Failed to list files');
    throw error;
  }
}

/**
 * Upload a file to the storage bucket
 */
async function uploadFile(
  file: string,
  options: UploadOptions
): Promise<void> {
  const config = loadConfig();
  validateStorageConfig(config);

  // Determine destination path
  const destination = options.destination || basename(file);
  const spinner = ora(`Uploading ${file}...`).start();

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName!,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    // Check if file exists in bucket
    if (!options.overwrite) {
      const exists = await storage.fileExists(destination);
      if (exists) {
        spinner.fail('File already exists');
        throw new StorageError(
          `File "${destination}" already exists in bucket`,
          'upload',
          config.gcpBucketName,
          'Use --overwrite to replace existing file'
        );
      }
    }

    const result = await storage.uploadFile(file, destination, (bytes, total) => {
      const percent = Math.round((bytes / total) * 100);
      spinner.text = `Uploading ${file}... ${percent}%`;
    });

    spinner.succeed(`Uploaded to ${config.gcpBucketName}/${destination}`);
    logger.keyValue('Size', `${(result.size / 1024).toFixed(1)} KB`);
    logger.keyValue('URL', result.publicUrl);
  } catch (error) {
    spinner.fail(`Failed to upload ${file}`);
    throw error;
  }
}

/**
 * Download a file from the storage bucket
 */
async function downloadFile(
  file: string,
  options: DownloadOptions
): Promise<void> {
  const config = loadConfig();
  validateStorageConfig(config);

  const output = options.output || basename(file);
  const spinner = ora(`Downloading ${file}...`).start();

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName!,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    // Check if local file exists
    if (!options.overwrite) {
      try {
        await stat(output);
        spinner.fail('Local file already exists');
        throw new StorageError(
          `Local file "${output}" already exists`,
          'download',
          config.gcpBucketName,
          'Use --overwrite to replace existing file'
        );
      } catch (err) {
        // File doesn't exist, which is what we want
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw err;
        }
      }
    }

    const result = await storage.downloadFile(file, output, (bytes, total) => {
      const percent = total > 0 ? Math.round((bytes / total) * 100) : 0;
      spinner.text = `Downloading ${file}... ${percent}%`;
    });

    spinner.succeed(`Downloaded to ${output}`);
    logger.keyValue('Size', `${(result.size / 1024).toFixed(1)} KB`);
  } catch (error) {
    spinner.fail(`Failed to download ${file}`);
    throw error;
  }
}

/**
 * Delete a file from the storage bucket
 */
async function deleteFile(
  file: string,
  options: DeleteOptions
): Promise<void> {
  const config = loadConfig();
  validateStorageConfig(config);

  if (!options.force) {
    logger.warn(`This will delete "${file}" from ${config.gcpBucketName}`);
    logger.info('Use --force to confirm deletion');
    return;
  }

  const spinner = ora(`Deleting ${file}...`).start();

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName!,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    await storage.deleteFile(file);
    spinner.succeed(`Deleted ${file} from ${config.gcpBucketName}`);
  } catch (error) {
    spinner.fail(`Failed to delete ${file}`);
    throw error;
  }
}

/**
 * Sync local files with the storage bucket
 */
async function syncFiles(options: SyncOptions): Promise<void> {
  const config = loadConfig();
  validateStorageConfig(config);

  const direction = options.direction || 'up';
  const dryRun = options.dryRun || false;

  logger.section('Syncing Files');
  logger.keyValue('Direction', direction === 'up' ? 'Local → Cloud' : 'Cloud → Local');
  logger.keyValue('Source', direction === 'up' ? config.outputDir : config.gcpBucketName!);
  logger.keyValue('Dry Run', dryRun ? 'Yes' : 'No');
  logger.newline();

  const spinner = ora('Analyzing files...').start();

  try {
    const storage = createGCPStorage({
      bucketName: config.gcpBucketName!,
      projectId: config.gcpProjectId,
      keyFilename: config.gcpKeyFile,
    });

    if (direction === 'up') {
      // Upload local files to cloud
      const pattern = join(config.outputDir, '**/*.mp3');
      const localFiles = await glob(pattern, { windowsPathsNoEscape: true });

      if (localFiles.length === 0) {
        spinner.stop();
        logger.warn(`No audio files found in ${config.outputDir}`);
        return;
      }

      // Get remote files for comparison
      const remoteFiles = await storage.listFiles();
      const remoteSet = new Set(remoteFiles.map((f) => f.name));

      // Categorize files
      const toUpload: Array<{ localPath: string; remotePath: string }> = [];
      const toSkip: string[] = [];

      for (const localPath of localFiles) {
        const parts = localPath.split(/[/\\]/);
        const filename = parts.pop() || '';
        const folder = parts.pop() || '';
        const remotePath = `${folder}/${filename}`;

        if (remoteSet.has(remotePath) && !options.overwrite) {
          toSkip.push(remotePath);
        } else {
          toUpload.push({ localPath, remotePath });
        }
      }

      spinner.stop();

      if (dryRun) {
        logger.info('Would upload:');
        toUpload.forEach((f) => {
          logger.log(`  + ${f.remotePath}`);
        });
        if (toSkip.length > 0) {
          logger.info('Would skip (already exists):');
          toSkip.forEach((f) => {
            logger.log(`  = ${f}`);
          });
        }
        logger.newline();
        logger.warn('Dry run - no changes made');
        return;
      }

      if (toUpload.length === 0) {
        logger.success('All files are already synced');
        return;
      }

      const uploadSpinner = ora('Uploading files...').start();
      const result = await storage.syncToRemote(
        toUpload,
        options.overwrite || false,
        (file, current, total) => {
          uploadSpinner.text = `Uploading ${file} (${current}/${total})...`;
        }
      );

      uploadSpinner.stop();

      logger.info('Sync Results:');
      logger.keyValue('Uploaded', result.uploaded.length.toString());
      logger.keyValue('Skipped', result.skipped.length.toString());
      if (result.errors.length > 0) {
        logger.keyValue('Errors', result.errors.length.toString());
        result.errors.forEach((e) => {
          logger.log(`  - ${e.file}: ${e.error}`);
        });
      }

      logger.newline();
      logger.success('Sync complete');
    } else {
      // Download cloud files to local
      const remoteFiles = await storage.listFiles();
      const audioFiles = remoteFiles.filter((f) =>
        f.name.endsWith('.mp3') || f.name.endsWith('.wav')
      );

      spinner.stop();

      if (audioFiles.length === 0) {
        logger.warn('No audio files found in bucket');
        return;
      }

      if (dryRun) {
        logger.info('Would download:');
        audioFiles.forEach((f) => {
          logger.log(`  + ${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
        });
        logger.newline();
        logger.warn('Dry run - no changes made');
        return;
      }

      const downloadSpinner = ora('Downloading files...').start();
      let downloaded = 0;
      let errors = 0;

      for (let i = 0; i < audioFiles.length; i++) {
        const file = audioFiles[i];
        const localPath = join(config.outputDir, file.name);
        downloadSpinner.text = `Downloading ${file.name} (${i + 1}/${audioFiles.length})...`;

        try {
          await storage.downloadFile(file.name, localPath);
          downloaded++;
        } catch {
          errors++;
        }
      }

      downloadSpinner.stop();

      logger.info('Sync Results:');
      logger.keyValue('Downloaded', downloaded.toString());
      logger.keyValue('Errors', errors.toString());
      logger.newline();
      logger.success('Sync complete');
    }
  } catch (error) {
    spinner.fail('Sync failed');
    throw error;
  }
}

/**
 * Create the storage command
 */
export function createStorageCommand(): Command {
  const storage = new Command('storage')
    .description('Manage audio files in GCP Cloud Storage');

  storage
    .command('list')
    .alias('ls')
    .description('List files in the storage bucket')
    .option('-p, --prefix <prefix>', 'Filter by prefix')
    .option('-l, --limit <number>', 'Maximum number of files to list')
    .option('--json', 'Output in JSON format')
    .action(withErrorHandling(listFiles));

  storage
    .command('upload <file>')
    .description('Upload a file to the storage bucket')
    .option('-d, --destination <path>', 'Destination path in bucket')
    .option('--overwrite', 'Overwrite existing files')
    .action(withErrorHandling(uploadFile));

  storage
    .command('download <file>')
    .description('Download a file from the storage bucket')
    .option('-o, --output <path>', 'Local output path')
    .option('--overwrite', 'Overwrite existing local files')
    .action(withErrorHandling(downloadFile));

  storage
    .command('delete <file>')
    .description('Delete a file from the storage bucket')
    .option('--force', 'Confirm deletion')
    .action(withErrorHandling(deleteFile));

  storage
    .command('sync')
    .description('Sync local files with the storage bucket')
    .option('-d, --direction <direction>', 'Sync direction (up/down)', 'up')
    .option('--dry-run', 'Show what would be synced without making changes')
    .option('--overwrite', 'Overwrite existing files')
    .action(withErrorHandling(syncFiles));

  return storage;
}
