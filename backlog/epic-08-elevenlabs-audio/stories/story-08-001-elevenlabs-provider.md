# Story 08-001: ElevenLabs Provider Integration

## Story

**As a** developer
**I want** to integrate ElevenLabs Text-to-Speech API
**So that** I can generate high-quality audio files

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Implement ElevenLabs TTS provider in the audio-cli package. ElevenLabs provides superior voice quality compared to OpenAI TTS.

## Acceptance Criteria

- [ ] ElevenLabs TTS service class created
- [ ] API authentication working
- [ ] Can generate audio from text
- [ ] Voice selection configurable
- [ ] Audio saved as MP3
- [ ] Error handling for API failures

## Technical Details

### API Endpoint

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

### Request Headers

```typescript
{
  'xi-api-key': process.env.ELEVENLABS_API_KEY,
  'Content-Type': 'application/json',
  'Accept': 'audio/mpeg'
}
```

### Request Body

```typescript
{
  text: string,
  model_id: 'eleven_monolingual_v1',
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75
  }
}
```

### Implementation

```typescript
import axios from 'axios';
import { writeFile } from 'fs/promises';

interface ElevenLabsOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

async function generateAudio(
  text: string,
  outputPath: string,
  options: ElevenLabsOptions = {}
): Promise<void> {
  const voiceId = options.voiceId || 'pNInz6obpgDQGcFmaJgB'; // Adam

  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarityBoost ?? 0.75,
      },
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      responseType: 'arraybuffer',
    }
  );

  await writeFile(outputPath, Buffer.from(response.data));
}
```

## Tasks

- [ ] Create ElevenLabs TTS service class
- [ ] Implement TTSProvider interface
- [ ] Add voice selection
- [ ] Handle rate limiting
- [ ] Add to provider factory
- [ ] Update CLI commands
- [ ] Test with sample text

## Notes

- ElevenLabs has usage limits based on subscription
- Voice IDs are specific to ElevenLabs
- Consider caching generated audio
