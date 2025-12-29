# Story 03-001: Implement Sequence Generator

## Story

**As a** developer
**I want** a sequence generator service
**So that** training sessions have properly distributed matches

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Implement the SequenceGenerator domain service that creates trial sequences with controlled match probability for position and audio stimuli.

## Acceptance Criteria

- [ ] Generate sequences for given n-back level
- [ ] Control match probability (~30% default)
- [ ] Support position-only, audio-only, and dual modes
- [ ] Random but reproducible sequences (seeded RNG option)
- [ ] No consecutive matches (to prevent patterns)
- [ ] Letters exclude similar-sounding pairs

## Technical Details

### SequenceGenerator Service

```typescript
// packages/core/src/services/SequenceGenerator.ts

export interface SequenceConfig {
  nBack: NBackLevel;
  trialCount: number;
  mode: TrainingMode;
  positionMatchProbability?: number; // default 0.3
  audioMatchProbability?: number;     // default 0.3
  seed?: number;                       // for reproducible sequences
}

export interface GeneratedTrial {
  position: number;      // 0-8 for 3x3 grid
  audioLetter: string;   // A-Z excluding similar sounds
  isPositionMatch: boolean;
  isAudioMatch: boolean;
}

export class SequenceGenerator {
  // Available letters (excluding similar-sounding: B/D, C/E, etc.)
  private static readonly LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

  generate(config: SequenceConfig): GeneratedTrial[] {
    const {
      nBack,
      trialCount,
      mode,
      positionMatchProbability = 0.3,
      audioMatchProbability = 0.3,
    } = config;

    const trials: GeneratedTrial[] = [];
    const positions: number[] = [];
    const letters: string[] = [];

    for (let i = 0; i < trialCount; i++) {
      let position: number;
      let letter: string;
      let isPositionMatch = false;
      let isAudioMatch = false;

      // Determine if this trial should be a match (after n-back warmup)
      const canBeMatch = i >= nBack;
      const shouldBePositionMatch = canBeMatch &&
        mode !== 'audio-only' &&
        Math.random() < positionMatchProbability &&
        !this.wasRecentMatch(trials, 'position', nBack);

      const shouldBeAudioMatch = canBeMatch &&
        mode !== 'position-only' &&
        Math.random() < audioMatchProbability &&
        !this.wasRecentMatch(trials, 'audio', nBack);

      // Generate position
      if (shouldBePositionMatch) {
        position = positions[i - nBack];
        isPositionMatch = true;
      } else {
        position = this.randomPositionExcluding(
          canBeMatch ? positions[i - nBack] : -1
        );
      }

      // Generate audio letter
      if (shouldBeAudioMatch) {
        letter = letters[i - nBack];
        isAudioMatch = true;
      } else {
        letter = this.randomLetterExcluding(
          canBeMatch ? letters[i - nBack] : ''
        );
      }

      positions.push(position);
      letters.push(letter);
      trials.push({ position, audioLetter: letter, isPositionMatch, isAudioMatch });
    }

    return trials;
  }

  private wasRecentMatch(
    trials: GeneratedTrial[],
    type: 'position' | 'audio',
    nBack: number
  ): boolean {
    // Prevent consecutive matches
    if (trials.length === 0) return false;
    const lastTrial = trials[trials.length - 1];
    return type === 'position' ? lastTrial.isPositionMatch : lastTrial.isAudioMatch;
  }

  private randomPositionExcluding(exclude: number): number {
    let pos: number;
    do {
      pos = Math.floor(Math.random() * 9);
    } while (pos === exclude);
    return pos;
  }

  private randomLetterExcluding(exclude: string): string {
    let letter: string;
    do {
      letter = SequenceGenerator.LETTERS[
        Math.floor(Math.random() * SequenceGenerator.LETTERS.length)
      ];
    } while (letter === exclude);
    return letter;
  }
}
```

## Tasks

- [ ] Create packages/core/src/services/SequenceGenerator.ts
- [ ] Implement generate() method
- [ ] Add match probability controls
- [ ] Prevent consecutive matches
- [ ] Add letter exclusion logic
- [ ] Export from services/index.ts
- [ ] Write unit tests with various configurations
- [ ] Test match distributions are approximately correct

## Dependencies

- Story 01-006 (Domain Entities - for types)

## Notes

- Letters are chosen to be phonetically distinct when spoken
- 30% match rate provides good challenge without frustration
- Seeded RNG enables reproducible test scenarios
