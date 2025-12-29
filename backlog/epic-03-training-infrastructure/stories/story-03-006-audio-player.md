# Story 03-006: Implement Audio Player

## Story

**As a** developer
**I want** an audio player adapter
**So that** letter sounds and feedback play during training

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Implement the IAudioPlayer port interface using Howler.js for reliable cross-browser audio playback.

## Acceptance Criteria

- [ ] Implements IAudioPlayer interface
- [ ] Plays letter sounds clearly
- [ ] Plays feedback sounds (correct/incorrect/tick)
- [ ] Volume control works
- [ ] Mute/unmute functionality
- [ ] Preloads sounds on initialization
- [ ] Handles audio context issues (autoplay policy)

## Technical Details

### HowlerAudioPlayer

```typescript
// src/infrastructure/audio/HowlerAudioPlayer.ts
import { Howl, Howler } from 'howler';
import type { IAudioPlayer } from '@neuralift/core';

export class HowlerAudioPlayer implements IAudioPlayer {
  private letterSounds: Map<string, Howl> = new Map();
  private feedbackSounds: Map<string, Howl> = new Map();
  private initialized = false;
  private muted = false;

  private static readonly LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize letter sounds
    for (const letter of HowlerAudioPlayer.LETTERS) {
      const sound = new Howl({
        src: [`/audio/letters/${letter.toLowerCase()}.mp3`],
        preload: true,
        volume: 0.8,
      });
      this.letterSounds.set(letter, sound);
    }

    // Initialize feedback sounds
    this.feedbackSounds.set(
      'correct',
      new Howl({
        src: ['/audio/feedback/correct.mp3'],
        preload: true,
        volume: 0.5,
      })
    );

    this.feedbackSounds.set(
      'incorrect',
      new Howl({
        src: ['/audio/feedback/incorrect.mp3'],
        preload: true,
        volume: 0.5,
      })
    );

    this.feedbackSounds.set(
      'tick',
      new Howl({
        src: ['/audio/feedback/tick.mp3'],
        preload: true,
        volume: 0.3,
      })
    );

    this.initialized = true;
  }

  async playLetter(letter: string): Promise<void> {
    if (!this.initialized || this.muted) return;

    const sound = this.letterSounds.get(letter.toUpperCase());
    if (sound) {
      sound.play();
    } else {
      console.warn(`No sound loaded for letter: ${letter}`);
    }
  }

  async playFeedback(type: 'correct' | 'incorrect' | 'tick'): Promise<void> {
    if (!this.initialized || this.muted) return;

    const sound = this.feedbackSounds.get(type);
    if (sound) {
      sound.play();
    }
  }

  setVolume(volume: number): void {
    // Volume should be 0-100, Howler uses 0-1
    const normalizedVolume = Math.max(0, Math.min(100, volume)) / 100;
    Howler.volume(normalizedVolume);
  }

  mute(): void {
    this.muted = true;
    Howler.mute(true);
  }

  unmute(): void {
    this.muted = false;
    Howler.mute(false);
  }

  destroy(): void {
    // Unload all sounds
    for (const sound of this.letterSounds.values()) {
      sound.unload();
    }
    for (const sound of this.feedbackSounds.values()) {
      sound.unload();
    }
    this.letterSounds.clear();
    this.feedbackSounds.clear();
    this.initialized = false;
  }
}
```

### Audio Files Structure

```
public/
└── audio/
    ├── letters/
    │   ├── c.mp3
    │   ├── h.mp3
    │   ├── k.mp3
    │   ├── l.mp3
    │   ├── q.mp3
    │   ├── r.mp3
    │   ├── s.mp3
    │   └── t.mp3
    └── feedback/
        ├── correct.mp3
        ├── incorrect.mp3
        └── tick.mp3
```

## Tasks

- [ ] Create src/infrastructure/audio/ directory
- [ ] Create HowlerAudioPlayer.ts
- [ ] Implement all IAudioPlayer methods
- [ ] Create/obtain letter audio files
- [ ] Create/obtain feedback audio files
- [ ] Add audio files to public/audio/
- [ ] Test audio playback in browser
- [ ] Handle autoplay policy gracefully
- [ ] Export from infrastructure index

## Dependencies

- Story 01-005 (Port Interfaces)
- Story 01-001 (Howler.js installed)

## Notes

- Audio files should be short and clear
- Letter sounds can be generated with TTS or recorded
- Feedback sounds should be subtle but noticeable
- Howler handles cross-browser compatibility
