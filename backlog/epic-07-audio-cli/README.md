# Epic 07: Audio CLI Tool

## Overview

Build a standalone command-line application that leverages LLMs (OpenAI, Anthropic, Gemini) to generate and manage audio files for the Neuralift training application. The CLI will connect to GCP Cloud Storage to upload, analyze, and manage audio assets.

## Goals

- Create a standalone Node.js CLI tool with TypeScript
- Implement multi-provider LLM integration (OpenAI, Anthropic, Gemini)
- Generate high-quality audio files for letters and feedback sounds
- Connect to GCP Cloud Storage for file management
- Provide analysis and validation of existing audio files
- Support batch processing for efficient asset generation

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 07-001 | [Initialize CLI Project](./stories/story-07-001-cli-setup.md) | 5 | Critical | DONE |
| 07-002 | [LLM Provider Abstraction](./stories/story-07-002-llm-providers.md) | 8 | Critical | DONE |
| 07-003 | [OpenAI TTS Integration](./stories/story-07-003-openai-tts.md) | 5 | Critical | DONE |
| 07-004 | [Google Cloud TTS Integration](./stories/story-07-004-google-tts.md) | 5 | High | DONE |
| 07-005 | [GCP Storage Connection](./stories/story-07-005-gcp-storage.md) | 5 | Critical | DONE |
| 07-006 | [Audio File Analysis](./stories/story-07-006-audio-analysis.md) | 5 | High | DONE |
| 07-007 | [Batch Generation Command](./stories/story-07-007-batch-generation.md) | 5 | High | DONE |
| 07-008 | [Storage Management Commands](./stories/story-07-008-storage-management.md) | 5 | Medium | DONE |
| 07-009 | [Interactive Mode](./stories/story-07-009-interactive-mode.md) | 3 | Low | DONE |
| 07-010 | [Audio Quality Validation](./stories/story-07-010-audio-validation.md) | 3 | Medium | DONE |

**Total Points: 49**

## CLI Commands (Target)

```bash
# Audio Generation
neuralift-audio generate letter C          # Generate single letter audio
neuralift-audio generate letters           # Generate all letter audio files
neuralift-audio generate feedback          # Generate feedback sound files

# GCP Storage Management
neuralift-audio storage list               # List files in bucket
neuralift-audio storage upload <file>      # Upload audio file
neuralift-audio storage download <file>    # Download audio file
neuralift-audio storage sync               # Sync local files with bucket

# Analysis
neuralift-audio analyze <file>             # Analyze audio file properties
neuralift-audio analyze bucket             # Analyze all files in bucket
neuralift-audio validate                   # Validate audio files meet requirements

# Interactive
neuralift-audio interactive                # Start interactive session
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| CLI Framework | Commander.js or Yargs |
| LLM Providers | OpenAI, Anthropic, Google AI |
| TTS Providers | OpenAI TTS, Google Cloud TTS |
| Cloud Storage | @google-cloud/storage |
| Audio Processing | ffmpeg, fluent-ffmpeg |
| Interactive UI | Inquirer.js |

## LLM Usage

The LLM integration is used for:
- Generating phonetically optimal letter pronunciations
- Creating natural-sounding feedback messages
- Analyzing audio quality and suggesting improvements
- Providing intelligent batch processing recommendations

## Acceptance Criteria

- [x] CLI installs globally via npm
- [x] Supports OpenAI, Anthropic, and Gemini providers
- [x] Generates MP3 audio files for all 8 letters (C, H, K, L, Q, R, S, T)
- [x] Generates feedback sounds (correct, incorrect, tick, complete)
- [x] Connects to GCP Cloud Storage bucket
- [x] Lists, uploads, downloads, and deletes files in bucket
- [x] Validates audio files meet quality requirements
- [x] Provides batch processing with progress indicators
- [x] Works cross-platform (Windows, macOS, Linux)

## Dependencies

- Epic 01: Foundation (for understanding audio requirements)
- Epic 03: Training Infrastructure (specifically story-03-006 for audio interfaces)

## Blocked By

- GCP bucket must be created (`neuralift-audio`)
- API keys for LLM providers

## Blocks

- None (standalone tool)

## Audio File Specifications

| Type | Format | Sample Rate | Bit Rate | Duration |
|------|--------|-------------|----------|----------|
| Letters | MP3 | 44.1 kHz | 128 kbps | 0.5-1.5s |
| Correct | MP3 | 44.1 kHz | 128 kbps | 0.2-0.5s |
| Incorrect | MP3 | 44.1 kHz | 128 kbps | 0.2-0.5s |
| Tick | MP3 | 44.1 kHz | 128 kbps | 0.05-0.1s |
| Complete | MP3 | 44.1 kHz | 128 kbps | 0.5-1.0s |
