/**
 * SequenceGenerator Service
 *
 * Generates pseudo-random sequences for training sessions.
 * Ensures appropriate match frequency based on N-back level.
 * Supports seeded RNG for reproducible sequences.
 */

import type { NBackLevel } from '../domain/value-objects/NBackLevel';
import type { TrainingMode } from '../domain/value-objects/TrainingMode';
import { modeIncludesPosition, modeIncludesAudio } from '../domain/value-objects/TrainingMode';

/**
 * Configuration for sequence generation
 */
export interface SequenceConfig {
  /** N-back level (1-9) */
  nBack: NBackLevel;
  /** Number of trials to generate */
  trialCount: number;
  /** Training mode */
  mode: TrainingMode;
  /** Probability of position match (default: 0.3) */
  positionMatchProbability?: number;
  /** Probability of audio match (default: 0.3) */
  audioMatchProbability?: number;
  /** Optional seed for reproducible sequences */
  seed?: number;
}

/**
 * Represents a generated trial in the sequence
 */
export interface GeneratedTrial {
  /** Position index (0-8) for 3x3 grid */
  position: number;
  /** Letter to speak */
  audioLetter: string;
  /** Whether this trial is a position match */
  isPositionMatch: boolean;
  /** Whether this trial is an audio match */
  isAudioMatch: boolean;
}

/**
 * Simple seeded pseudo-random number generator (Mulberry32)
 * Provides reproducible random sequences when a seed is provided
 */
function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * SequenceGenerator
 *
 * Generates training sequences with controlled match probabilities.
 * Prevents consecutive matches and uses phonetically distinct letters.
 */
export class SequenceGenerator {
  /**
   * Available letters for audio stimuli
   * Phonetically distinct to avoid confusion when spoken
   * Excludes similar-sounding pairs (B/D, C/E, F/S, M/N, P/B, etc.)
   */
  private static readonly LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

  /** Number of positions in the 3x3 grid */
  private static readonly GRID_SIZE = 9;

  /** Default match probability */
  private static readonly DEFAULT_MATCH_PROBABILITY = 0.3;

  /**
   * Generates a sequence of trials based on the provided configuration
   */
  generate(config: SequenceConfig): GeneratedTrial[] {
    const {
      nBack,
      trialCount,
      mode,
      positionMatchProbability = SequenceGenerator.DEFAULT_MATCH_PROBABILITY,
      audioMatchProbability = SequenceGenerator.DEFAULT_MATCH_PROBABILITY,
      seed,
    } = config;

    // Use seeded RNG if seed provided, otherwise use Math.random
    const random = seed !== undefined ? createSeededRandom(seed) : Math.random.bind(Math);

    const trials: GeneratedTrial[] = [];
    const positions: number[] = [];
    const letters: string[] = [];

    const includesPosition = modeIncludesPosition(mode);
    const includesAudio = modeIncludesAudio(mode);

    for (let i = 0; i < trialCount; i++) {
      let position: number;
      let letter: string;
      let isPositionMatch = false;
      let isAudioMatch = false;

      // Can only be a match after n-back warmup trials
      const canBeMatch = i >= nBack;

      // Determine if this trial should be a position match
      const shouldBePositionMatch =
        canBeMatch &&
        includesPosition &&
        random() < positionMatchProbability &&
        !this.wasRecentMatch(trials, 'position', nBack);

      // Determine if this trial should be an audio match
      const shouldBeAudioMatch =
        canBeMatch &&
        includesAudio &&
        random() < audioMatchProbability &&
        !this.wasRecentMatch(trials, 'audio', nBack);

      // Generate position
      if (shouldBePositionMatch && positions.length >= nBack) {
        position = positions[i - nBack]!;
        isPositionMatch = true;
      } else {
        // Generate random position, avoiding match if we shouldn't match
        const excludePosition = canBeMatch && positions.length >= nBack ? positions[i - nBack] : -1;
        position = this.randomPositionExcluding(excludePosition!, random);
      }

      // Generate audio letter
      if (shouldBeAudioMatch && letters.length >= nBack) {
        letter = letters[i - nBack]!;
        isAudioMatch = true;
      } else {
        // Generate random letter, avoiding match if we shouldn't match
        const excludeLetter = canBeMatch && letters.length >= nBack ? letters[i - nBack] : '';
        letter = this.randomLetterExcluding(excludeLetter!, random);
      }

      positions.push(position);
      letters.push(letter);
      trials.push({
        position,
        audioLetter: letter,
        isPositionMatch,
        isAudioMatch,
      });
    }

    return trials;
  }

  /**
   * Checks if there was a match in the most recent trial
   * Used to prevent consecutive matches which create predictable patterns
   */
  private wasRecentMatch(
    trials: GeneratedTrial[],
    type: 'position' | 'audio',
    nBack: number
  ): boolean {
    if (trials.length === 0) return false;
    const lastTrial = trials[trials.length - 1]!;
    return type === 'position' ? lastTrial.isPositionMatch : lastTrial.isAudioMatch;
  }

  /**
   * Generates a random position, excluding the specified position
   */
  private randomPositionExcluding(exclude: number, random: () => number): number {
    let pos: number;
    do {
      pos = Math.floor(random() * SequenceGenerator.GRID_SIZE);
    } while (pos === exclude);
    return pos;
  }

  /**
   * Generates a random letter, excluding the specified letter
   */
  private randomLetterExcluding(exclude: string, random: () => number): string {
    let letter: string;
    do {
      letter = SequenceGenerator.LETTERS[
        Math.floor(random() * SequenceGenerator.LETTERS.length)
      ]!;
    } while (letter === exclude);
    return letter;
  }

  /**
   * Returns the available letters used for audio stimuli
   */
  static getAvailableLetters(): readonly string[] {
    return SequenceGenerator.LETTERS;
  }

  /**
   * Returns the grid size (number of positions)
   */
  static getGridSize(): number {
    return SequenceGenerator.GRID_SIZE;
  }
}

/**
 * Factory function to create a SequenceGenerator instance
 */
export function createSequenceGenerator(): SequenceGenerator {
  return new SequenceGenerator();
}
