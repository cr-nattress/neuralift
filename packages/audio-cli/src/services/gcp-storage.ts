import { Storage, Bucket, File } from '@google-cloud/storage';
import { createReadStream, createWriteStream } from 'fs';
import { stat, mkdir } from 'fs/promises';
import { dirname, basename } from 'path';
import { logger } from '../utils/logger.js';
import { ConfigError, StorageError } from '../utils/errors.js';

export interface GCPStorageConfig {
  bucketName: string;
  projectId?: string;
  keyFilename?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  updated: string;
  contentType: string;
}

export interface UploadResult {
  remotePath: string;
  size: number;
  publicUrl: string;
}

export interface DownloadResult {
  localPath: string;
  size: number;
}

export interface SyncResult {
  uploaded: string[];
  skipped: string[];
  errors: Array<{ file: string; error: string }>;
}

/**
 * GCP Cloud Storage Service
 */
export class GCPStorageService {
  private storage: Storage;
  private bucket: Bucket;
  private bucketName: string;

  constructor(config: GCPStorageConfig) {
    this.bucketName = config.bucketName;
    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });
    this.bucket = this.storage.bucket(config.bucketName);
  }

  /**
   * Check if the service can connect to the bucket
   */
  async isAvailable(): Promise<boolean> {
    try {
      const [exists] = await this.bucket.exists();
      return exists;
    } catch {
      return false;
    }
  }

  /**
   * List files in the bucket
   */
  async listFiles(prefix?: string): Promise<FileInfo[]> {
    try {
      const [files] = await this.bucket.getFiles({ prefix });
      return files.map((file: File) => ({
        name: file.name,
        size: Number(file.metadata.size) || 0,
        updated: String(file.metadata.updated || ''),
        contentType: String(file.metadata.contentType || 'application/octet-stream'),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to list files: ${message}`,
        'list',
        this.bucketName
      );
    }
  }

  /**
   * Upload a file to the bucket
   */
  async uploadFile(
    localPath: string,
    remotePath: string,
    onProgress?: (bytesWritten: number, totalBytes: number) => void
  ): Promise<UploadResult> {
    try {
      const stats = await stat(localPath);
      const totalBytes = stats.size;

      const file = this.bucket.file(remotePath);
      const writeStream = file.createWriteStream({
        metadata: {
          cacheControl: 'public, max-age=31536000',
          contentType: this.getContentType(localPath),
        },
        resumable: false,
      });

      const readStream = createReadStream(localPath);
      let bytesWritten = 0;

      return new Promise((resolve, reject) => {
        readStream.on('data', (chunk: Buffer) => {
          bytesWritten += chunk.length;
          if (onProgress) {
            onProgress(bytesWritten, totalBytes);
          }
        });

        readStream.pipe(writeStream)
          .on('finish', () => {
            resolve({
              remotePath,
              size: totalBytes,
              publicUrl: `https://storage.googleapis.com/${this.bucketName}/${remotePath}`,
            });
          })
          .on('error', reject);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to upload file: ${message}`,
        'upload',
        this.bucketName
      );
    }
  }

  /**
   * Download a file from the bucket
   */
  async downloadFile(
    remotePath: string,
    localPath: string,
    onProgress?: (bytesRead: number, totalBytes: number) => void
  ): Promise<DownloadResult> {
    try {
      // Ensure local directory exists
      await mkdir(dirname(localPath), { recursive: true });

      const file = this.bucket.file(remotePath);
      const [metadata] = await file.getMetadata();
      const totalBytes = Number(metadata.size) || 0;

      const readStream = file.createReadStream();
      const writeStream = createWriteStream(localPath);
      let bytesRead = 0;

      return new Promise((resolve, reject) => {
        readStream.on('data', (chunk: Buffer) => {
          bytesRead += chunk.length;
          if (onProgress) {
            onProgress(bytesRead, totalBytes);
          }
        });

        readStream.pipe(writeStream)
          .on('finish', () => {
            resolve({
              localPath,
              size: bytesRead,
            });
          })
          .on('error', reject);

        readStream.on('error', reject);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to download file: ${message}`,
        'download',
        this.bucketName
      );
    }
  }

  /**
   * Delete a file from the bucket
   */
  async deleteFile(remotePath: string): Promise<void> {
    try {
      await this.bucket.file(remotePath).delete();
      logger.debug(`Deleted ${remotePath} from bucket`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to delete file: ${message}`,
        'delete',
        this.bucketName
      );
    }
  }

  /**
   * Check if a file exists in the bucket
   */
  async fileExists(remotePath: string): Promise<boolean> {
    try {
      const [exists] = await this.bucket.file(remotePath).exists();
      return exists;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(remotePath: string): Promise<FileInfo | null> {
    try {
      const file = this.bucket.file(remotePath);
      const [metadata] = await file.getMetadata();
      return {
        name: remotePath,
        size: Number(metadata.size) || 0,
        updated: String(metadata.updated || ''),
        contentType: String(metadata.contentType || 'application/octet-stream'),
      };
    } catch {
      return null;
    }
  }

  /**
   * Sync local directory to bucket
   */
  async syncToRemote(
    localFiles: Array<{ localPath: string; remotePath: string }>,
    overwrite: boolean = false,
    onProgress?: (file: string, current: number, total: number) => void
  ): Promise<SyncResult> {
    const result: SyncResult = {
      uploaded: [],
      skipped: [],
      errors: [],
    };

    for (let i = 0; i < localFiles.length; i++) {
      const { localPath, remotePath } = localFiles[i];

      if (onProgress) {
        onProgress(basename(localPath), i + 1, localFiles.length);
      }

      try {
        // Check if file exists remotely
        if (!overwrite && await this.fileExists(remotePath)) {
          result.skipped.push(remotePath);
          continue;
        }

        await this.uploadFile(localPath, remotePath);
        result.uploaded.push(remotePath);
      } catch (error) {
        result.errors.push({
          file: localPath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return result;
  }

  /**
   * Get content type based on file extension
   */
  private getContentType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();
    switch (ext) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'json':
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }
}

/**
 * Create a GCP Storage service from environment config
 */
export function createGCPStorage(config: GCPStorageConfig): GCPStorageService {
  if (!config.bucketName) {
    throw new ConfigError(
      'GCP bucket name is required',
      'Set GCP_BUCKET_NAME environment variable'
    );
  }

  return new GCPStorageService(config);
}
