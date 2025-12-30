# @neuralift/audio-cli

CLI tool for generating and managing audio files for the Neuralift dual n-back training application.

## Installation

```bash
# Install globally
npm install -g @neuralift/audio-cli

# Or run directly with npx
npx @neuralift/audio-cli
```

## Quick Start

```bash
# Generate audio for a single letter
neuralift-audio generate letter C

# Generate all letter audio files
neuralift-audio generate letters

# Generate feedback sounds
neuralift-audio generate feedback

# List files in cloud storage
neuralift-audio storage list

# Analyze an audio file
neuralift-audio analyze file ./audio/c.mp3
```

## Commands

### Generate

Generate audio files for training:

```bash
neuralift-audio generate letter <letter>   # Generate single letter (C, H, K, L, Q, R, S, T)
neuralift-audio generate letters           # Generate all letter audio files
neuralift-audio generate feedback          # Generate feedback sounds
```

Options:
- `-p, --provider <provider>` - TTS provider (openai, google)
- `-v, --voice <voice>` - Voice to use
- `-o, --output <path>` - Output path/directory

### Storage

Manage audio files in GCP Cloud Storage:

```bash
neuralift-audio storage list               # List files in bucket
neuralift-audio storage upload <file>      # Upload a file
neuralift-audio storage download <file>    # Download a file
neuralift-audio storage sync               # Sync local files with bucket
```

### Analyze

Analyze and validate audio files:

```bash
neuralift-audio analyze file <file>        # Analyze a single file
neuralift-audio analyze bucket             # Analyze all files in bucket
neuralift-audio analyze validate           # Validate files meet requirements
```

### Interactive

Start an interactive session:

```bash
neuralift-audio interactive
```

### Config

Display current configuration:

```bash
neuralift-audio config
```

## Configuration

The CLI can be configured using environment variables. Create a `.env` file:

```env
# LLM API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# GCP Configuration
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=neuralift-audio
GCP_KEY_FILE=/path/to/service-account.json

# Default Providers
DEFAULT_LLM_PROVIDER=openai
DEFAULT_TTS_PROVIDER=openai

# Output Settings
OUTPUT_DIR=./audio-output
VERBOSE=false
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Audio Specifications

| Type | Format | Sample Rate | Bit Rate | Duration |
|------|--------|-------------|----------|----------|
| Letters | MP3 | 44.1 kHz | 128 kbps | 0.5-1.5s |
| Correct | MP3 | 44.1 kHz | 128 kbps | 0.2-0.5s |
| Incorrect | MP3 | 44.1 kHz | 128 kbps | 0.2-0.5s |
| Tick | MP3 | 44.1 kHz | 128 kbps | 0.05-0.1s |
| Complete | MP3 | 44.1 kHz | 128 kbps | 0.5-1.0s |

## License

MIT
