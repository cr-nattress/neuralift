# Story 07-007: Batch Generation Command

## Story

**As a** developer
**I want** to generate all audio files in a single command
**So that** I can efficiently create the complete audio asset set

## Points: 5

## Priority: High

## Status: DONE

## Description

Implement batch generation capabilities that can generate all letter and feedback audio files in a single command, with progress tracking, error recovery, and optional upload to GCP.

## Acceptance Criteria

- [ ] Generate all letter audio files (C, H, K, L, Q, R, S, T)
- [ ] Generate all feedback sounds (correct, incorrect, tick, complete)
- [ ] Progress bar showing completion status
- [ ] Continue on error (don't stop on single failure)
- [ ] Summary report at end
- [ ] Optional auto-upload to GCP after generation
- [ ] Dry-run mode to preview what would be generated

## Technical Details

### CLI Commands

```bash
# Generate all letters
neuralift-audio generate letters --voice onyx --provider openai

# Generate all feedback sounds
neuralift-audio generate feedback --voice echo --provider openai

# Generate everything
neuralift-audio generate all --upload

# Dry run
neuralift-audio generate all --dry-run
```

### Implementation

```typescript
interface BatchOptions {
  provider: 'openai' | 'google';
  voice?: string;
  outputDir: string;
  upload: boolean;
  dryRun: boolean;
}

interface BatchResult {
  successful: string[];
  failed: { file: string; error: string }[];
  totalTime: number;
  uploaded: boolean;
}

async function generateBatch(
  type: 'letters' | 'feedback' | 'all',
  options: BatchOptions
): Promise<BatchResult> {
  const items = type === 'letters' ? LETTERS
    : type === 'feedback' ? FEEDBACK_TYPES
    : [...LETTERS, ...FEEDBACK_TYPES];

  const results: BatchResult = {
    successful: [],
    failed: [],
    totalTime: 0,
    uploaded: false,
  };

  const progress = new ProgressBar(':current/:total [:bar] :file', {
    total: items.length,
  });

  for (const item of items) {
    try {
      if (!options.dryRun) {
        await generateSingle(item, options);
      }
      results.successful.push(item);
    } catch (error) {
      results.failed.push({ file: item, error: error.message });
    }
    progress.tick({ file: item });
  }

  if (options.upload && !options.dryRun && results.failed.length === 0) {
    await uploadAll(options.outputDir);
    results.uploaded = true;
  }

  return results;
}
```

### Progress Display

```
Generating audio files...

Letters:  8/8  [████████████████████████████████] 100% c.mp3
Feedback: 4/4  [████████████████████████████████] 100% complete.mp3

Summary:
  ✓ 12 files generated successfully
  ✗ 0 files failed
  ⏱ Total time: 45.3s
  ☁ Uploaded to GCP: Yes
```

## Tasks

- [ ] Create batch generation service
- [ ] Implement progress bar with ora/cli-progress
- [ ] Add continue-on-error logic
- [ ] Implement dry-run mode
- [ ] Add summary report generation
- [ ] Integrate with GCP upload
- [ ] Add confirmation prompt before upload
- [ ] Create generation manifest file
- [ ] Support resuming failed batches
- [ ] Add parallel generation option (with rate limiting)

## Notes

- Consider rate limits when generating many files
- Save manifest of generated files for tracking
- Allow specifying subset of files to regenerate
