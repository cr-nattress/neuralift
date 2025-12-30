# Story 07-003: OpenAI TTS Integration

## Story

**As a** developer
**I want** to generate audio using OpenAI's Text-to-Speech API
**So that** I can create high-quality letter and feedback audio files

## Points: 5

## Priority: Critical

## Status: DONE

## Description

Integrate OpenAI's Text-to-Speech (TTS) API to generate audio files for letters and feedback sounds. OpenAI TTS provides natural-sounding voices with multiple voice options.

## Acceptance Criteria

- [ ] OpenAI TTS client configured
- [ ] Can generate audio for single letters
- [ ] Can generate audio for feedback sounds
- [ ] Voice selection configurable
- [ ] Audio saved in MP3 format
- [ ] Progress indication during generation
- [ ] Error handling for API failures

## Technical Details

### OpenAI TTS Options

| Voice | Description | Best For |
|-------|-------------|----------|
| alloy | Neutral | General purpose |
| echo | Warm | Feedback sounds |
| fable | Storytelling | Not recommended |
| onyx | Deep | Letters (clarity) |
| nova | Friendly | Alternative |
| shimmer | Clear | Letters (clarity) |

### Implementation

```typescript
import OpenAI from 'openai';
import fs from 'fs';

interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  model?: 'tts-1' | 'tts-1-hd';
  speed?: number; // 0.25 to 4.0
}

async function generateAudio(
  text: string,
  outputPath: string,
  options: TTSOptions = {}
): Promise<void> {
  const openai = new OpenAI();

  const response = await openai.audio.speech.create({
    model: options.model || 'tts-1-hd',
    voice: options.voice || 'onyx',
    input: text,
    speed: options.speed || 1.0,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(outputPath, buffer);
}
```

### Letter Pronunciations

Use LLM to generate optimal phonetic text for clear pronunciation:

| Letter | Phonetic Text | Notes |
|--------|---------------|-------|
| C | "See" | Clear 'S' sound |
| H | "Aitch" | Standard pronunciation |
| K | "Kay" | Clear 'K' sound |
| L | "Ell" | Standard pronunciation |
| Q | "Cue" | Clear 'Q' sound |
| R | "Are" | Standard pronunciation |
| S | "Ess" | Clear 'S' sound |
| T | "Tee" | Clear 'T' sound |

## Tasks

- [ ] Create OpenAI TTS service class
- [ ] Implement single letter generation
- [ ] Implement feedback sound generation
- [ ] Add voice selection via CLI flag
- [ ] Use LLM to optimize phonetic pronunciations
- [ ] Save files with correct naming convention
- [ ] Add generation progress spinner
- [ ] Handle rate limiting
- [ ] Test with all voices
- [ ] Document best voice/settings choices

## Notes

- tts-1-hd is higher quality but slower
- Consider generating multiple versions for A/B testing
- Cache LLM phonetic optimization results
