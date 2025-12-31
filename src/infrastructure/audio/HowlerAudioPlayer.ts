'use client';

/**
 * HowlerAudioPlayer
 *
 * Implements IAudioPlayer using Howler.js for cross-browser audio playback.
 * Falls back to Web Speech API for letters and Web Audio API for feedback tones
 * when audio files are not available.
 */

import { Howl, Howler } from 'howler';
import type { IAudioPlayer, FeedbackSoundType } from '@neuralift/core';

/**
 * Configuration for audio file paths
 * Can be overridden via environment variables
 * When empty, we skip file loading and use fallbacks directly
 */
const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_BUCKET_URL || '';
const USE_AUDIO_FILES = !!AUDIO_BASE_URL;

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

/**
 * Feedback tone configurations (frequency in Hz, duration in ms)
 */
const FEEDBACK_TONES: Record<FeedbackSoundType, { freq: number; duration: number; type: OscillatorType }> = {
  correct: { freq: 880, duration: 150, type: 'sine' },
  incorrect: { freq: 220, duration: 200, type: 'square' },
  tick: { freq: 1000, duration: 50, type: 'sine' },
  complete: { freq: 660, duration: 300, type: 'sine' },
};

export class HowlerAudioPlayer implements IAudioPlayer {
  private letterSounds: Map<string, Howl> = new Map();
  private feedbackSounds: Map<FeedbackSoundType, Howl> = new Map();
  private failedLetters: Set<string> = new Set();
  private failedFeedback: Set<FeedbackSoundType> = new Set();
  private audioContext: AudioContext | null = null;
  private initialized = false;
  private muted = false;
  private volume = 80; // 0-100 scale
  private useSpeechSynthesis = false;

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
   * Get or create the AudioContext for tone generation
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a tone using Web Audio API
   */
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        const vol = (this.volume / 100) * 0.3; // Keep tones quieter
        gainNode.gain.setValueAtTime(vol, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);

        setTimeout(resolve, duration);
      } catch {
        resolve();
      }
    });
  }

  /**
   * Play a letter using Web Speech API
   */
  private speakLetter(letter: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.rate = 1.2;
      utterance.pitch = 1.0;
      utterance.volume = this.volume / 100;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
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

      // Check if speech synthesis is available
      this.useSpeechSynthesis = 'speechSynthesis' in window;

      // Only load audio files if bucket URL is configured
      if (USE_AUDIO_FILES) {
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
            onloaderror: () => {
              console.log(`[HowlerAudioPlayer] Using tone fallback for "${type}"`);
              this.failedFeedback.add(type);
            },
          });
          this.feedbackSounds.set(type, sound);
        }

        console.log('[HowlerAudioPlayer] Initialized with audio files');
      } else {
        // No audio files configured - use fallbacks directly
        // Mark all letters and feedback as "failed" so they use fallbacks
        for (const letter of AVAILABLE_LETTERS) {
          this.failedLetters.add(letter);
        }
        const feedbackTypes: FeedbackSoundType[] = ['correct', 'incorrect', 'tick', 'complete'];
        for (const type of feedbackTypes) {
          this.failedFeedback.add(type);
        }
        console.log('[HowlerAudioPlayer] Initialized with Web Speech + Web Audio fallbacks (no audio files configured)');
      }

      this.initialized = true;
    } catch (error) {
      console.error('[HowlerAudioPlayer] Initialization failed:', error);
      // Still mark as initialized to allow speech fallback
      this.initialized = true;
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

    // Try Howler first, fall back to speech synthesis
    if (this.failedLetters.has(normalizedLetter) || !this.letterSounds.has(normalizedLetter)) {
      if (this.useSpeechSynthesis) {
        return this.speakLetter(normalizedLetter);
      }
      return;
    }

    const sound = this.letterSounds.get(normalizedLetter);

    if (sound) {
      return new Promise<void>((resolve) => {
        const id = sound.play();
        sound.once('end', () => resolve(), id);
        sound.once('stop', () => resolve(), id);
        sound.once('playerror', () => {
          // Fallback to speech on play error
          this.failedLetters.add(normalizedLetter);
          if (this.useSpeechSynthesis) {
            this.speakLetter(normalizedLetter).then(resolve);
          } else {
            resolve();
          }
        }, id);
      });
    } else if (this.useSpeechSynthesis) {
      return this.speakLetter(normalizedLetter);
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

    // Use tone fallback if file failed to load
    if (this.failedFeedback.has(type)) {
      const tone = FEEDBACK_TONES[type];
      return this.playTone(tone.freq, tone.duration, tone.type);
    }

    const sound = this.feedbackSounds.get(type);

    if (sound) {
      return new Promise<void>((resolve) => {
        const id = sound.play();
        sound.once('end', () => resolve(), id);
        sound.once('stop', () => resolve(), id);
        sound.once('playerror', () => {
          // Fallback to tone on play error
          this.failedFeedback.add(type);
          const tone = FEEDBACK_TONES[type];
          this.playTone(tone.freq, tone.duration, tone.type).then(resolve);
        }, id);
      });
    } else {
      // Fallback to tone
      const tone = FEEDBACK_TONES[type];
      return this.playTone(tone.freq, tone.duration, tone.type);
    }
  }

  /**
   * Preload specific letters for faster playback
   */
  async preload(letters: string[]): Promise<void> {
    // Skip if no audio files configured
    if (!USE_AUDIO_FILES) return;

    const loadPromises: Promise<void>[] = [];

    for (const letter of letters) {
      const normalizedLetter = letter.toUpperCase();

      // Skip if already loaded or failed
      if (this.letterSounds.has(normalizedLetter) || this.failedLetters.has(normalizedLetter)) continue;

      // Only load valid letters
      if (!AVAILABLE_LETTERS.includes(normalizedLetter as typeof AVAILABLE_LETTERS[number])) {
        console.warn(`[HowlerAudioPlayer] Invalid letter for preload: ${letter}`);
        continue;
      }

      const loadPromise = new Promise<void>((resolve) => {
        const sound = new Howl({
          src: [this.getLetterPath(normalizedLetter)],
          preload: true,
          volume: DEFAULT_VOLUMES.letter * (this.volume / 100),
          html5: false,
          onload: () => {
            this.letterSounds.set(normalizedLetter, sound);
            resolve();
          },
          onloaderror: () => {
            console.log(`[HowlerAudioPlayer] Using speech fallback for letter "${normalizedLetter}"`);
            this.failedLetters.add(normalizedLetter);
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
