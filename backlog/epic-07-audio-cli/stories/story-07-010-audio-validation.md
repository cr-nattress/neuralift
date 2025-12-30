# Story 07-010: Audio Quality Validation

## Story

**As a** developer
**I want** to validate audio files meet quality requirements
**So that** I can ensure consistent audio experience in the app

## Points: 3

## Priority: Medium

## Status: DONE

## Description

Implement comprehensive audio validation that checks files against defined specifications and provides actionable feedback. Use LLM for intelligent quality assessment beyond basic metrics.

## Acceptance Criteria

- [ ] Validate audio format (MP3)
- [ ] Validate sample rate (44.1kHz)
- [ ] Validate bit rate (128kbps minimum)
- [ ] Validate duration (within expected range)
- [ ] Check for audio issues (clipping, silence)
- [ ] LLM-powered quality assessment
- [ ] Generate validation report

## Technical Details

### Validation Rules

```typescript
const VALIDATION_RULES = {
  letters: {
    format: 'mp3',
    sampleRate: 44100,
    minBitRate: 128000,
    minDuration: 0.3,
    maxDuration: 1.5,
    channels: [1, 2], // mono or stereo
  },
  feedback: {
    correct: { minDuration: 0.1, maxDuration: 0.5 },
    incorrect: { minDuration: 0.1, maxDuration: 0.5 },
    tick: { minDuration: 0.03, maxDuration: 0.15 },
    complete: { minDuration: 0.3, maxDuration: 1.0 },
  },
};
```

### Implementation

```typescript
interface ValidationResult {
  file: string;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

interface ValidationError {
  rule: string;
  expected: string;
  actual: string;
}

async function validateAudioFile(
  filePath: string,
  type: 'letter' | 'feedback'
): Promise<ValidationResult> {
  const metadata = await analyzeAudio(filePath);
  const rules = VALIDATION_RULES[type];

  const result: ValidationResult = {
    file: filePath,
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
  };

  // Check format
  if (metadata.format !== rules.format) {
    result.errors.push({
      rule: 'format',
      expected: rules.format,
      actual: metadata.format,
    });
    result.valid = false;
  }

  // Check sample rate
  if (metadata.sampleRate !== rules.sampleRate) {
    result.errors.push({
      rule: 'sampleRate',
      expected: `${rules.sampleRate}Hz`,
      actual: `${metadata.sampleRate}Hz`,
    });
    result.valid = false;
  }

  // Check for clipping
  if (await detectClipping(filePath)) {
    result.warnings.push({
      type: 'clipping',
      message: 'Audio may contain clipping distortion',
    });
  }

  // LLM suggestions
  const llmFeedback = await getLLMQualityFeedback(metadata, type);
  result.suggestions = llmFeedback.suggestions;

  return result;
}
```

### Validation Report

```
Audio Validation Report
═══════════════════════════════════════════════════════

Letters (8 files)
─────────────────
✓ c.mp3      44.1kHz  128kbps  0.72s  VALID
✓ h.mp3      44.1kHz  128kbps  0.68s  VALID
✗ k.mp3      22.0kHz  64kbps   0.45s  INVALID
  └─ Errors:
     • sampleRate: expected 44100Hz, got 22050Hz
     • bitRate: expected ≥128kbps, got 64kbps
✓ l.mp3      44.1kHz  128kbps  0.71s  VALID
...

Feedback (4 files)
──────────────────
✓ correct.mp3    0.23s  VALID
✓ incorrect.mp3  0.31s  VALID
⚠ tick.mp3       0.08s  WARNING
  └─ Warning: Duration (0.08s) is close to minimum (0.03s)
✓ complete.mp3   0.65s  VALID

Summary
───────
Valid:    10/12 files
Invalid:  1/12 files
Warnings: 1/12 files

Suggestions (AI):
• Consider regenerating k.mp3 with higher quality settings
• tick.mp3 could benefit from a slightly longer duration
```

## Tasks

- [ ] Define validation rules for all file types
- [ ] Implement metadata validation
- [ ] Add clipping detection
- [ ] Add silence detection
- [ ] Integrate LLM for quality suggestions
- [ ] Create validation report formatter
- [ ] Add CLI command: validate <file>
- [ ] Add CLI command: validate --all
- [ ] Support JSON output for CI integration
- [ ] Add auto-fix suggestions

## Notes

- Consider waveform analysis for advanced detection
- Cache validation results for unchanged files
- Exit with error code for CI when validation fails
