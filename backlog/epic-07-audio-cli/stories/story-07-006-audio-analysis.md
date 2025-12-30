# Story 07-006: Audio File Analysis

## Story

**As a** developer
**I want** to analyze audio file properties
**So that** I can ensure files meet quality requirements

## Points: 5

## Priority: High

## Status: DONE

## Description

Implement audio file analysis capabilities to inspect properties like duration, bitrate, sample rate, and format. Use LLM to provide intelligent analysis and recommendations.

## Acceptance Criteria

- [ ] Can extract audio metadata (duration, bitrate, sample rate)
- [ ] Can analyze audio quality metrics
- [ ] LLM provides analysis summary
- [ ] Can analyze single file or entire bucket
- [ ] Output in human-readable and JSON formats
- [ ] Identifies files that don't meet specifications

## Technical Details

### Dependencies

```bash
npm install fluent-ffmpeg @types/fluent-ffmpeg
# Requires ffmpeg/ffprobe installed on system
```

### Audio Properties to Extract

| Property | Description | Target |
|----------|-------------|--------|
| Duration | Length in seconds | 0.05-1.5s |
| Sample Rate | Hz | 44100 |
| Bit Rate | kbps | 128+ |
| Channels | Mono/Stereo | Mono preferred |
| Format | Container | MP3 |
| Codec | Audio codec | MP3/MPEG |

### Implementation

```typescript
import ffmpeg from 'fluent-ffmpeg';

interface AudioMetadata {
  duration: number;
  sampleRate: number;
  bitRate: number;
  channels: number;
  format: string;
  codec: string;
  fileSize: number;
}

async function analyzeAudio(filePath: string): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);

      const audio = metadata.streams.find(s => s.codec_type === 'audio');
      resolve({
        duration: metadata.format.duration || 0,
        sampleRate: audio?.sample_rate || 0,
        bitRate: metadata.format.bit_rate || 0,
        channels: audio?.channels || 0,
        format: metadata.format.format_name || '',
        codec: audio?.codec_name || '',
        fileSize: metadata.format.size || 0,
      });
    });
  });
}
```

### LLM Analysis Prompt

```typescript
const analysisPrompt = `
Analyze these audio file properties for a training application:

File: ${filename}
Duration: ${duration}s
Sample Rate: ${sampleRate}Hz
Bit Rate: ${bitRate}kbps
Channels: ${channels}
Format: ${format}

Requirements:
- Letters should be 0.5-1.5 seconds
- Feedback sounds should be 0.05-0.5 seconds
- Sample rate should be 44100Hz
- Bit rate should be 128kbps or higher

Provide:
1. Does this file meet requirements? (Yes/No)
2. Any issues found
3. Recommendations for improvement
`;
```

## Tasks

- [ ] Install fluent-ffmpeg
- [ ] Create audio analysis service
- [ ] Extract all relevant metadata
- [ ] Implement quality validation against specs
- [ ] Create LLM analysis integration
- [ ] Add CLI command: analyze <file>
- [ ] Add CLI command: analyze bucket
- [ ] Output in table and JSON formats
- [ ] Handle missing ffmpeg gracefully
- [ ] Document ffmpeg installation

## Notes

- ffmpeg must be installed on the system
- Consider bundling ffmpeg for easier distribution
- Cache analysis results for large batches
