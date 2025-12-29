/**
 * IAudioPlayer Port
 *
 * Interface for audio playback functionality.
 * Implementations handle letter pronunciation and feedback sounds.
 */

export type FeedbackSoundType = 'correct' | 'incorrect' | 'tick' | 'complete';

export interface IAudioPlayer {
  /**
   * Initialize the audio player and preload sounds
   */
  initialize(): Promise<void>;

  /**
   * Play a letter sound
   */
  playLetter(letter: string): Promise<void>;

  /**
   * Play a feedback sound
   */
  playFeedback(type: FeedbackSoundType): Promise<void>;

  /**
   * Preload specific letters for faster playback
   */
  preload(letters: string[]): Promise<void>;

  /**
   * Set the master volume (0-100)
   */
  setVolume(volume: number): void;

  /**
   * Get the current volume (0-100)
   */
  getVolume(): number;

  /**
   * Mute all audio
   */
  mute(): void;

  /**
   * Unmute audio
   */
  unmute(): void;

  /**
   * Check if audio is muted
   */
  isMuted(): boolean;

  /**
   * Stop all currently playing sounds
   */
  stop(): void;

  /**
   * Clean up and release audio resources
   */
  destroy(): void;
}
