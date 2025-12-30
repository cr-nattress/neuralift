# Story 07-004: Google Cloud TTS Integration

## Story

**As a** developer
**I want** to generate audio using Google Cloud Text-to-Speech
**So that** I have an alternative TTS provider with different voice options

## Points: 5

## Priority: High

## Status: DONE

## Description

Integrate Google Cloud Text-to-Speech as an alternative to OpenAI TTS. Google offers a wide variety of voices including WaveNet and Neural2 for high-quality synthesis.

## Acceptance Criteria

- [ ] Google Cloud TTS client configured
- [ ] Can generate audio for letters
- [ ] Can generate audio for feedback sounds
- [ ] Voice and language selection
- [ ] Audio saved in MP3 format
- [ ] SSML support for fine-tuned pronunciation
- [ ] Error handling for API failures

## Technical Details

### Google Cloud TTS Voice Options

| Voice Type | Quality | Cost | Example |
|------------|---------|------|---------|
| Standard | Basic | Low | en-US-Standard-A |
| WaveNet | High | Medium | en-US-Wavenet-D |
| Neural2 | Highest | High | en-US-Neural2-A |

### Dependencies

```bash
npm install @google-cloud/text-to-speech
```

### Implementation

```typescript
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';

interface GoogleTTSOptions {
  languageCode?: string;
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
}

async function generateAudio(
  text: string,
  outputPath: string,
  options: GoogleTTSOptions = {}
): Promise<void> {
  const client = new textToSpeech.TextToSpeechClient();

  const request = {
    input: { text },
    voice: {
      languageCode: options.languageCode || 'en-US',
      name: options.voiceName || 'en-US-Neural2-D',
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: options.speakingRate || 1.0,
      pitch: options.pitch || 0,
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  await fs.promises.writeFile(outputPath, response.audioContent as Buffer);
}
```

### SSML for Precise Pronunciation

```xml
<speak>
  <prosody rate="slow" pitch="+2st">
    <phoneme alphabet="ipa" ph="keɪ">K</phoneme>
  </prosody>
</speak>
```

## Tasks

- [ ] Set up Google Cloud credentials
- [ ] Create Google TTS service class
- [ ] Implement audio generation
- [ ] Add SSML support for fine-tuned pronunciation
- [ ] Implement voice selection
- [ ] Create TTS provider abstraction (shared with OpenAI)
- [ ] Add CLI flag for TTS provider selection
- [ ] Compare quality with OpenAI TTS
- [ ] Document credential setup

## Notes

- Requires Google Cloud project with TTS API enabled
- Service account key or Application Default Credentials
- Consider using Neural2 voices for best quality
