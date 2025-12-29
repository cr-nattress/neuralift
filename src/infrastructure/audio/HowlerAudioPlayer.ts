'use client';

/**
 * HowlerAudioPlayer
 *
 * Implements IAudioPlayer using Howler.js for cross-browser audio playback.
 * Handles letter sounds, feedback sounds, and audio context management.
 */

import { Howl, Howler } from 'howler';
import type { IAudioPlayer, FeedbackSoundType } from '@neuralift/core';

/**
 * Configuration for audio file paths
 * Can be overridden via environment variables
 */
const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_BUCKET_URL || '';

/**
 * Available letters for audio playback
 * These are phonetically distinct to avoid confusion
 */
const AVAILABLE_LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'] as const;

/**
 * Default volume levels for different sound types
 */
const DEFAULT_VOLUMES = {
  letter: 0.8,
  correct: 0.5,
  incorrect: 0.5,
  tick: 0.3,
  complete: 0.6,
} as const;

export class HowlerAudioPlayer implements IAudioPlayer {
  private letterSounds: Map<string, Howl> = new Map();
  private feedbackSounds: Map<FeedbackSoundType, Howl> = new Map();
  private initialized = false;
  private muted = false;
  private volume = 80; // 0-100 scale

  /**
   * Get the audio file path for a letter
   */
  private getLetterPath(letter: string): string {
    const basePath = AUDIO_BASE_URL || '/audio';
    return `${basePath}/letters/${letter.toLowerCase()}.mp3`;
  }

  /**
   * Get the audio file path for a feedback sound
   */
  private getFeedbackPath(type: FeedbackSoundType): string {
    const basePath = AUDIO_BASE_URL || '/audio';
    return `${basePath}/feedback/${type}.mp3`;
  }

  /**
   * Initialize the audio player and preload all sounds
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Resume AudioContext if suspended (browser autoplay policy)
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        await Howler.ctx.resume();
      }

      // Initialize letter sounds
      await this.preload([...AVAILABLE_LETTERS]);

      // Initialize feedback sounds
      const feedbackTypes: FeedbackSoundType[] = ['correct', 'incorrect', 'tick', 'complete'];

      for (const type of feedbackTypes) {
        const sound = new Howl({
          src: [this.getFeedbackPath(type)],
          preload: true,
          volume: DEFAULT_VOLUMES[type] * (this.volume / 100),
          html5: false, // Use Web Audio API for lower latency
          onloaderror: (_id, error) => {
            console.warn(`Failed to load feedback sound "${type}":`, error);
          },
        });
        this.feedbackSounds.set(type, sound);
      }

      this.initialized = true;
      console.log('[HowlerAudioPlayer] Initialized successfully');
    } catch (error) {
      console.error('[HowlerAudioPlayer] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Play a letter sound
   */
  async playLetter(letter: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.muted) return;

    const normalizedLetter = letter.toUpperCase();
    const sound = this.letterSounds.get(normalizedLetter);

    if (sound) {
      return new Promise<void>((resolve) => {
        const id = sound.play();
        sound.once('end', () => resolve(), id);
        sound.once('stop', () => resolve(), id);
      });
    } else {
      console.warn(`[HowlerAudioPlayer] No sound loaded for letter: ${letter}`);
    }
  }

  /**
   * Play a feedback sound
   */
  async playFeedback(type: FeedbackSoundType): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.muted) return;

    const sound = this.feedbackSounds.get(type);

    if (sound) {
      return new Promise<void>((resolve) => {
        const id = sound.play();
        sound.once('end', () => resolve(), id);
        sound.once('stop', () => resolve(), id);
      });
    } else {
      console.warn(`[HowlerAudioPlayer] No sound loaded for feedback type: ${type}`);
    }
  }

  /**
   * Preload specific letters for faster playback
   */
  async preload(letters: string[]): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    for (const letter of letters) {
      const normalizedLetter = letter.toUpperCase();

      // Skip if already loaded
      if (this.letterSounds.has(normalizedLetter)) continue;

      // Only load valid letters
      if (!AVAILABLE_LETTERS.includes(normalizedLetter as typeof AVAILABLE_LETTERS[number])) {
        console.warn(`[HowlerAudioPlayer] Invalid letter for preload: ${letter}`);
        continue;
      }

      const loadPromise = new Promise<void>((resolve, reject) => {
        const sound = new Howl({
          src: [this.getLetterPath(normalizedLetter)],
          preload: true,
          volume: DEFAULT_VOLUMES.letter * (this.volume / 100),
          html5: false,
          onload: () => {
            this.letterSounds.set(normalizedLetter, sound);
            resolve();
          },
          onloaderror: (_id, error) => {
            console.warn(`[HowlerAudioPlayer] Failed to load letter "${normalizedLetter}":`, error);
            // Resolve anyway to not block other sounds
            resolve();
          },
        });
      });

      loadPromises.push(loadPromise);
    }

    await Promise.all(loadPromises);
  }

  /**
   * Set the master volume (0-100)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    const normalizedVolume = this.volume / 100;

    Howler.volume(normalizedVolume);

    // Update individual sound volumes
    for (const sound of this.letterSounds.values()) {
      sound.volume(DEFAULT_VOLUMES.letter * normalizedVolume);
    }

    this.feedbackSounds.forEach((sound, type) => {
      sound.volume(DEFAULT_VOLUMES[type] * normalizedVolume);
    });
  }

  /**
   * Get the current volume (0-100)
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Mute all audio
   */
  mute(): void {
    this.muted = true;
    Howler.mute(true);
  }

  /**
   * Unmute audio
   */
  unmute(): void {
    this.muted = false;
    Howler.mute(false);
  }

  /**
   * Check if audio is muted
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Stop all currently playing sounds
   */
  stop(): void {
    for (const sound of this.letterSounds.values()) {
      sound.stop();
    }
    for (const sound of this.feedbackSounds.values()) {
      sound.stop();
    }
  }

  /**
   * Clean up and release audio resources
   */
  destroy(): void {
    this.stop();

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
