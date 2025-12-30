# Story 07-005: GCP Storage Connection

## Story

**As a** developer
**I want** to connect to GCP Cloud Storage
**So that** I can manage audio files in the neuralift-audio bucket

## Points: 5

## Priority: Critical

## Status: DONE

## Description

Implement GCP Cloud Storage integration to upload, download, list, and manage audio files in the `neuralift-audio` bucket. This enables the CLI to directly deploy generated audio to the production storage.

## Acceptance Criteria

- [ ] GCP Storage client configured
- [ ] Can list files in bucket
- [ ] Can upload files to bucket
- [ ] Can download files from bucket
- [ ] Can delete files from bucket
- [ ] Proper error handling for permissions
- [ ] Progress indication for uploads/downloads

## Technical Details

### Dependencies

```bash
npm install @google-cloud/storage
```

### Configuration

```typescript
interface GCPStorageConfig {
  bucketName: string;
  projectId?: string;
  keyFilename?: string; // Path to service account key
}

const config: GCPStorageConfig = {
  bucketName: process.env.GCP_BUCKET_NAME || 'neuralift-audio',
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};
```

### Implementation

```typescript
import { Storage } from '@google-cloud/storage';

class GCPStorageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(config: GCPStorageConfig) {
    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });
    this.bucket = this.storage.bucket(config.bucketName);
  }

  async listFiles(prefix?: string): Promise<FileInfo[]> {
    const [files] = await this.bucket.getFiles({ prefix });
    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      updated: file.metadata.updated,
      contentType: file.metadata.contentType,
    }));
  }

  async uploadFile(localPath: string, remotePath: string): Promise<void> {
    await this.bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    await this.bucket.file(remotePath).download({
      destination: localPath,
    });
  }

  async deleteFile(remotePath: string): Promise<void> {
    await this.bucket.file(remotePath).delete();
  }
}
```

### Bucket Structure

```
neuralift-audio/
├── letters/
│   ├── c.mp3
│   ├── h.mp3
│   ├── k.mp3
│   ├── l.mp3
│   ├── q.mp3
│   ├── r.mp3
│   ├── s.mp3
│   └── t.mp3
└── feedback/
    ├── correct.mp3
    ├── incorrect.mp3
    ├── tick.mp3
    └── complete.mp3
```

## Tasks

- [ ] Install @google-cloud/storage
- [ ] Create GCP storage service class
- [ ] Implement file listing
- [ ] Implement file upload with progress
- [ ] Implement file download with progress
- [ ] Implement file deletion
- [ ] Add bucket structure validation
- [ ] Create CLI commands (storage list, upload, download)
- [ ] Handle authentication errors gracefully
- [ ] Document credential setup

## Notes

- Use Application Default Credentials for local development
- Service account needs Storage Object Admin role
- Set appropriate cache headers for CDN
