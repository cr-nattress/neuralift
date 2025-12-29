/**
 * Trial Entity
 *
 * Represents a single trial in a training session.
 * Uses immutable pattern - methods return new Trial instances.
 */

import type { PositionIndex } from '../value-objects/Position';

/**
 * Raw trial data for serialization
 */
export interface TrialData {
  readonly id: number;
  readonly position: PositionIndex;
  readonly audioLetter: string;
  readonly isPositionMatch: boolean;
  readonly isAudioMatch: boolean;
  readonly userPositionResponse: boolean | null;
  readonly userAudioResponse: boolean | null;
  readonly positionResponseTime: number | null;
  readonly audioResponseTime: number | null;
  readonly stimulusTimestamp: number;
}

/**
 * Immutable Trial entity
 */
export class Trial {
  private constructor(private readonly data: TrialData) {}

  /**
   * Creates a new Trial
   */
  static create(
    id: number,
    position: PositionIndex,
    audioLetter: string,
    isPositionMatch: boolean,
    isAudioMatch: boolean
  ): Trial {
    return new Trial({
      id,
      position,
      audioLetter,
      isPositionMatch,
      isAudioMatch,
      userPositionResponse: null,
      userAudioResponse: null,
      positionResponseTime: null,
      audioResponseTime: null,
      stimulusTimestamp: Date.now(),
    });
  }

  /**
   * Creates a Trial from existing data (for deserialization)
   */
  static fromData(data: TrialData): Trial {
    return new Trial(data);
  }

  // Getters
  get id(): number {
    return this.data.id;
  }

  get position(): PositionIndex {
    return this.data.position;
  }

  get audioLetter(): string {
    return this.data.audioLetter;
  }

  get isPositionMatch(): boolean {
    return this.data.isPositionMatch;
  }

  get isAudioMatch(): boolean {
    return this.data.isAudioMatch;
  }

  get userPositionResponse(): boolean | null {
    return this.data.userPositionResponse;
  }

  get userAudioResponse(): boolean | null {
    return this.data.userAudioResponse;
  }

  get positionResponseTime(): number | null {
    return this.data.positionResponseTime;
  }

  get audioResponseTime(): number | null {
    return this.data.audioResponseTime;
  }

  get stimulusTimestamp(): number {
    return this.data.stimulusTimestamp;
  }

  /**
   * Records a position response, returning a new Trial instance
   */
  recordPositionResponse(response: boolean): Trial {
    const responseTime = Date.now() - this.data.stimulusTimestamp;
    return new Trial({
      ...this.data,
      userPositionResponse: response,
      positionResponseTime: responseTime,
    });
  }

  /**
   * Records an audio response, returning a new Trial instance
   */
  recordAudioResponse(response: boolean): Trial {
    const responseTime = Date.now() - this.data.stimulusTimestamp;
    return new Trial({
      ...this.data,
      userAudioResponse: response,
      audioResponseTime: responseTime,
    });
  }

  /**
   * Checks if position response was correct
   */
  isPositionCorrect(): boolean {
    if (this.data.userPositionResponse === null) {
      // No response - miss if it was a match, correct rejection otherwise
      return !this.data.isPositionMatch;
    }
    return this.data.userPositionResponse === this.data.isPositionMatch;
  }

  /**
   * Checks if audio response was correct
   */
  isAudioCorrect(): boolean {
    if (this.data.userAudioResponse === null) {
      // No response - miss if it was a match, correct rejection otherwise
      return !this.data.isAudioMatch;
    }
    return this.data.userAudioResponse === this.data.isAudioMatch;
  }

  /**
   * Gets position response category for stats calculation
   */
  getPositionCategory(): 'hit' | 'miss' | 'falseAlarm' | 'correctRejection' {
    const responded = this.data.userPositionResponse === true;
    const isMatch = this.data.isPositionMatch;

    if (isMatch && responded) return 'hit';
    if (isMatch && !responded) return 'miss';
    if (!isMatch && responded) return 'falseAlarm';
    return 'correctRejection';
  }

  /**
   * Gets audio response category for stats calculation
   */
  getAudioCategory(): 'hit' | 'miss' | 'falseAlarm' | 'correctRejection' {
    const responded = this.data.userAudioResponse === true;
    const isMatch = this.data.isAudioMatch;

    if (isMatch && responded) return 'hit';
    if (isMatch && !responded) return 'miss';
    if (!isMatch && responded) return 'falseAlarm';
    return 'correctRejection';
  }

  /**
   * Checks if any response has been recorded
   */
  hasResponse(): boolean {
    return this.data.userPositionResponse !== null || this.data.userAudioResponse !== null;
  }

  /**
   * Serializes the trial to JSON
   */
  toJSON(): TrialData {
    return { ...this.data };
  }
}
