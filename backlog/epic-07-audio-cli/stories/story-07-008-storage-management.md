# Story 07-008: Storage Management Commands

## Story

**As a** developer
**I want** comprehensive storage management commands
**So that** I can easily manage audio files in GCP

## Points: 5

## Priority: Medium

## Status: DONE

## Description

Implement a full set of storage management commands for listing, syncing, comparing, and managing audio files between local directories and GCP Cloud Storage.

## Acceptance Criteria

- [ ] List files with metadata (size, date, type)
- [ ] Sync local directory to bucket
- [ ] Sync bucket to local directory
- [ ] Compare local vs remote files
- [ ] Bulk delete with confirmation
- [ ] Copy/move files within bucket
- [ ] Generate signed URLs for testing

## Technical Details

### CLI Commands

```bash
# List files
neuralift-audio storage list
neuralift-audio storage list --prefix letters/
neuralift-audio storage list --format json

# Sync
neuralift-audio storage sync --direction up     # Local to GCP
neuralift-audio storage sync --direction down   # GCP to Local
neuralift-audio storage sync --dry-run

# Compare
neuralift-audio storage diff                    # Show differences

# Delete
neuralift-audio storage delete letters/c.mp3
neuralift-audio storage delete --prefix letters/ --confirm

# URL generation
neuralift-audio storage url letters/c.mp3 --expires 1h
```

### Sync Implementation

```typescript
interface SyncOptions {
  direction: 'up' | 'down';
  dryRun: boolean;
  deleteOrphans: boolean;
}

interface SyncResult {
  uploaded: string[];
  downloaded: string[];
  deleted: string[];
  skipped: string[];
}

async function syncStorage(
  localDir: string,
  options: SyncOptions
): Promise<SyncResult> {
  const localFiles = await getLocalFiles(localDir);
  const remoteFiles = await getRemoteFiles();

  const diff = computeDiff(localFiles, remoteFiles);

  if (options.dryRun) {
    return { ...diff, uploaded: [], downloaded: [], deleted: [] };
  }

  // Perform sync based on direction
  if (options.direction === 'up') {
    for (const file of diff.toUpload) {
      await uploadFile(file);
    }
  } else {
    for (const file of diff.toDownload) {
      await downloadFile(file);
    }
  }

  return result;
}
```

### Diff Display

```
Comparing local vs remote...

  Local Only (will upload):
    + letters/c.mp3 (45.2 KB)
    + letters/h.mp3 (48.1 KB)

  Remote Only (will download):
    - feedback/tick.mp3 (12.3 KB)

  Different (will overwrite):
    ~ letters/k.mp3 (local: 45.2 KB, remote: 43.1 KB)

  Identical:
    = 8 files

Summary: 2 to upload, 1 to download, 1 to overwrite
```

## Tasks

- [ ] Implement file listing with formatting
- [ ] Add metadata display (size, date, content-type)
- [ ] Implement local/remote diff computation
- [ ] Create sync up functionality
- [ ] Create sync down functionality
- [ ] Add dry-run mode for sync
- [ ] Implement bulk delete with confirmation
- [ ] Add signed URL generation
- [ ] Support filtering by prefix/pattern
- [ ] Add JSON output format for scripting

## Notes

- Use checksums for accurate diff comparison
- Consider bandwidth costs for large syncs
- Implement resume capability for large uploads
