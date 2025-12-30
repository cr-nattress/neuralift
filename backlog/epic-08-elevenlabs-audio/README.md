# Epic 08: ElevenLabs Audio Integration

## Overview

Replace OpenAI TTS with ElevenLabs for higher quality, more natural-sounding audio generation. ElevenLabs provides superior voice quality and more control over voice characteristics.

## Goals

- Integrate ElevenLabs Text-to-Speech API
- Generate high-quality letter pronunciations (C, H, K, L, Q, R, S, T)
- Generate feedback sounds (correct, incorrect, tick, complete)
- Upload to GCP Cloud Storage for production use
- Update the web app to use the new audio files

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 08-001 | [ElevenLabs Provider Integration](./stories/story-08-001-elevenlabs-provider.md) | 5 | Critical | TODO |
| 08-002 | [Generate Letter Audio](./stories/story-08-002-generate-letters.md) | 3 | Critical | TODO |
| 08-003 | [Generate Feedback Audio](./stories/story-08-003-generate-feedback.md) | 3 | Critical | TODO |
| 08-004 | [Upload and Deploy Audio](./stories/story-08-004-deploy-audio.md) | 2 | Critical | TODO |
| 08-005 | [Update Web App Audio Config](./stories/story-08-005-update-webapp.md) | 2 | High | TODO |

**Total Points: 15**

## ElevenLabs API Details

### Endpoint
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

### Recommended Voices

| Voice | ID | Description |
|-------|-----|-------------|
| Adam | pNInz6obpgDQGcFmaJgB | Deep, clear male voice |
| Antoni | ErXwobaYiN019PkySvjV | Well-rounded male voice |
| Rachel | 21m00Tcm4TlvDq8ikWAM | Calm female voice |
| Domi | AZnzlk1XvdvUeBnXmlld | Strong female voice |

### Audio Settings

| Setting | Value |
|---------|-------|
| Model | eleven_monolingual_v1 |
| Output Format | mp3_44100_128 |
| Stability | 0.5 |
| Similarity Boost | 0.75 |

## Letter Pronunciations

| Letter | Text | Notes |
|--------|------|-------|
| C | "See" | Clear S sound |
| H | "Aitch" | Standard pronunciation |
| K | "Kay" | Clear K sound |
| L | "Ell" | Standard pronunciation |
| Q | "Queue" | Clear Q sound |
| R | "Are" | Standard pronunciation |
| S | "Ess" | Clear S sound |
| T | "Tee" | Clear T sound |

## Feedback Sounds

| Type | Text |
|------|------|
| correct | "Correct!" |
| incorrect | "Try again" |
| tick | "tick" |
| complete | "Session complete. Well done!" |

## Acceptance Criteria

- [ ] ElevenLabs TTS provider implemented
- [ ] All 8 letters generated with clear pronunciation
- [ ] All 4 feedback sounds generated
- [ ] Audio files uploaded to gs://neuralift-audio/
- [ ] Web app uses new audio files
- [ ] Audio plays correctly in browser

## Dependencies

- Epic 07: Audio CLI (base infrastructure)
- ElevenLabs API key

## Environment Variables

```
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```
