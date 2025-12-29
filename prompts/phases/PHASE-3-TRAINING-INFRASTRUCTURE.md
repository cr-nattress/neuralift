# Phase 3: Core Training Infrastructure

## Overview

Build the core game logic, state management, audio system, data persistence layer, and comprehensive user analytics system. This phase creates the "engine" that powers the dual n-back training experience and enables intelligent LLM-driven recommendations.

---

## Objectives

1. Implement n-back sequence generation algorithm
2. Create scoring and performance calculation system
3. Set up Zustand state management
4. Build audio playback system
5. Implement IndexedDB storage with Dexie.js
6. Define all level configurations
7. **Build comprehensive user interaction tracking system**
8. **Create user behavioral profile aggregation**
9. **Implement LLM integration layer for real-time feedback**

---

## Level Configuration System

### Create `src/lib/game/levelConfig.ts`

```typescript
import type { LevelConfig, TrainingMode } from '@/types';

export const LEVELS: Record<string, LevelConfig> = {
  // Phase 1: Foundations - Position Training
  'position-1back': {
    id: 'position-1back',
    name: 'Position 1-Back',
    description: 'Track grid positions, match from 1 step ago',
    mode: 'position-only',
    nBack: 1,
    trialDuration: 3000,
    defaultTrials: 20,
  },
  'position-2back': {
    id: 'position-2back',
    name: 'Position 2-Back',
    description: 'Track grid positions, match from 2 steps ago',
    mode: 'position-only',
    nBack: 2,
    trialDuration: 3000,
    defaultTrials: 20,
    unlockCriteria: {
      requiredLevel: 'position-1back',
      minAccuracy: 70,
      minSessions: 2,
    },
  },

  // Phase 1: Foundations - Audio Training
  'audio-1back': {
    id: 'audio-1back',
    name: 'Audio 1-Back',
    description: 'Track letter sounds, match from 1 step ago',
    mode: 'audio-only',
    nBack: 1,
    trialDuration: 3000,
    defaultTrials: 20,
  },
  'audio-2back': {
    id: 'audio-2back',
    name: 'Audio 2-Back',
    description: 'Track letter sounds, match from 2 steps ago',
    mode: 'audio-only',
    nBack: 2,
    trialDuration: 3000,
    defaultTrials: 20,
    unlockCriteria: {
      requiredLevel: 'audio-1back',
      minAccuracy: 70,
      minSessions: 2,
    },
  },

  // Phase 2: Integration - Dual Training
  'dual-1back': {
    id: 'dual-1back',
    name: 'Dual 1-Back',
    description: 'Track both position and audio simultaneously',
    mode: 'dual',
    nBack: 1,
    trialDuration: 3000,
    defaultTrials: 25,
    unlockCriteria: {
      requiredLevel: 'audio-2back',
      minAccuracy: 70,
      minSessions: 1,
    },
  },
  'dual-2back': {
    id: 'dual-2back',
    name: 'Dual 2-Back',
    description: 'The classic dual n-back used in research',
    mode: 'dual',
    nBack: 2,
    trialDuration: 3000,
    defaultTrials: 25,
    unlockCriteria: {
      requiredLevel: 'dual-1back',
      minAccuracy: 70,
      minSessions: 3,
    },
  },
  'dual-2back-fast': {
    id: 'dual-2back-fast',
    name: 'Dual 2-Back (Fast)',
    description: 'Dual 2-back with shorter trial duration',
    mode: 'dual',
    nBack: 2,
    trialDuration: 2500,
    defaultTrials: 25,
    unlockCriteria: {
      requiredLevel: 'dual-2back',
      minAccuracy: 75,
      minSessions: 5,
    },
  },

  // Phase 3: Advanced
  'dual-3back': {
    id: 'dual-3back',
    name: 'Dual 3-Back',
    description: 'Elite level - track 3 positions and 3 letters',
    mode: 'dual',
    nBack: 3,
    trialDuration: 3000,
    defaultTrials: 25,
    unlockCriteria: {
      requiredLevel: 'dual-2back-fast',
      minAccuracy: 80,
      minSessions: 5,
    },
  },
};

export const LEVEL_ORDER = [
  'position-1back',
  'position-2back',
  'audio-1back',
  'audio-2back',
  'dual-1back',
  'dual-2back',
  'dual-2back-fast',
  'dual-3back',
];

export const AUDIO_LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

export const GRID_SIZE = 9; // 3x3 grid
```

---

## Sequence Generation

### Create `src/lib/game/sequenceGenerator.ts`

```typescript
import type { Trial, NBackLevel, TrainingMode } from '@/types';
import { AUDIO_LETTERS, GRID_SIZE } from './levelConfig';

interface GeneratorConfig {
  nBack: NBackLevel;
  mode: TrainingMode;
  trialCount: number;
  matchProbability?: number; // Default ~30% matches
}

export function generateSequence(config: GeneratorConfig): Trial[] {
  const {
    nBack,
    mode,
    trialCount,
    matchProbability = 0.3,
  } = config;

  const trials: Trial[] = [];
  const positions: number[] = [];
  const letters: string[] = [];

  // Generate initial non-match trials (before n-back can apply)
  for (let i = 0; i < nBack; i++) {
    const position = getRandomPosition(positions, i);
    const letter = getRandomLetter(letters, i);

    positions.push(position);
    letters.push(letter);

    trials.push(createTrial(i, position, letter, false, false));
  }

  // Generate remaining trials with controlled match probability
  for (let i = nBack; i < trialCount; i++) {
    const shouldMatchPosition =
      mode !== 'audio-only' && Math.random() < matchProbability;
    const shouldMatchAudio =
      mode !== 'position-only' && Math.random() < matchProbability;

    let position: number;
    let letter: string;

    // Handle position
    if (mode === 'audio-only') {
      position = Math.floor(Math.random() * GRID_SIZE);
    } else if (shouldMatchPosition) {
      position = positions[i - nBack];
    } else {
      position = getRandomPositionExcluding(positions[i - nBack]);
    }

    // Handle audio
    if (mode === 'position-only') {
      letter = AUDIO_LETTERS[Math.floor(Math.random() * AUDIO_LETTERS.length)];
    } else if (shouldMatchAudio) {
      letter = letters[i - nBack];
    } else {
      letter = getRandomLetterExcluding(letters[i - nBack]);
    }

    positions.push(position);
    letters.push(letter);

    const isPositionMatch = mode !== 'audio-only' && position === positions[i - nBack];
    const isAudioMatch = mode !== 'position-only' && letter === letters[i - nBack];

    trials.push(createTrial(i, position, letter, isPositionMatch, isAudioMatch));
  }

  return trials;
}

function createTrial(
  id: number,
  position: number,
  audioLetter: string,
  isPositionMatch: boolean,
  isAudioMatch: boolean
): Trial {
  return {
    id,
    position,
    audioLetter,
    isPositionMatch,
    isAudioMatch,
    userPositionResponse: null,
    userAudioResponse: null,
    responseTime: null,
  };
}

function getRandomPosition(existing: number[], index: number): number {
  // For first few trials, just random
  return Math.floor(Math.random() * GRID_SIZE);
}

function getRandomLetter(existing: string[], index: number): string {
  return AUDIO_LETTERS[Math.floor(Math.random() * AUDIO_LETTERS.length)];
}

function getRandomPositionExcluding(exclude: number): number {
  let position: number;
  do {
    position = Math.floor(Math.random() * GRID_SIZE);
  } while (position === exclude);
  return position;
}

function getRandomLetterExcluding(exclude: string): string {
  let letter: string;
  do {
    letter = AUDIO_LETTERS[Math.floor(Math.random() * AUDIO_LETTERS.length)];
  } while (letter === exclude);
  return letter;
}
```

---

## Scoring System

### Create `src/lib/game/scorer.ts`

```typescript
import type { Trial, PerformanceStats, SessionResult } from '@/types';

export function calculateStats(
  trials: Trial[],
  type: 'position' | 'audio'
): PerformanceStats {
  const isMatchKey = type === 'position' ? 'isPositionMatch' : 'isAudioMatch';
  const responseKey = type === 'position' ? 'userPositionResponse' : 'userAudioResponse';

  let hits = 0;
  let misses = 0;
  let falseAlarms = 0;
  let correctRejections = 0;

  for (const trial of trials) {
    const isMatch = trial[isMatchKey];
    const userResponse = trial[responseKey];

    if (isMatch && userResponse) {
      hits++;
    } else if (isMatch && !userResponse) {
      misses++;
    } else if (!isMatch && userResponse) {
      falseAlarms++;
    } else {
      correctRejections++;
    }
  }

  const totalMatches = hits + misses;
  const totalNonMatches = falseAlarms + correctRejections;

  const hitRate = totalMatches > 0 ? hits / totalMatches : 0;
  const falseAlarmRate = totalNonMatches > 0 ? falseAlarms / totalNonMatches : 0;

  const dPrime = calculateDPrime(hitRate, falseAlarmRate);
  const accuracy = trials.length > 0
    ? (hits + correctRejections) / trials.length
    : 0;

  return {
    hits,
    misses,
    falseAlarms,
    correctRejections,
    hitRate,
    falseAlarmRate,
    dPrime,
    accuracy,
  };
}

export function calculateDPrime(hitRate: number, falseAlarmRate: number): number {
  // Adjust extreme values to avoid infinite d-prime
  const adjustedHitRate = Math.min(Math.max(hitRate, 0.01), 0.99);
  const adjustedFARate = Math.min(Math.max(falseAlarmRate, 0.01), 0.99);

  // Calculate z-scores using inverse normal distribution approximation
  const zHit = inverseNormalCDF(adjustedHitRate);
  const zFA = inverseNormalCDF(adjustedFARate);

  return zHit - zFA;
}

// Approximation of inverse normal CDF (probit function)
function inverseNormalCDF(p: number): number {
  // Rational approximation for inverse normal CDF
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.383577518672690e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239e0;

  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;

  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838e0;
  const c4 = -2.549732539343734e0;
  const c5 = 4.374664141464968e0;
  const c6 = 2.938163982698783e0;

  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996e0;
  const d4 = 3.754408661907416e0;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }
}

export function calculateCombinedAccuracy(
  positionStats: PerformanceStats,
  audioStats: PerformanceStats,
  mode: 'position-only' | 'audio-only' | 'dual'
): number {
  switch (mode) {
    case 'position-only':
      return positionStats.accuracy;
    case 'audio-only':
      return audioStats.accuracy;
    case 'dual':
      return (positionStats.accuracy + audioStats.accuracy) / 2;
  }
}
```

---

## State Management

### Create `src/stores/gameStore.ts`

```typescript
import { create } from 'zustand';
import type { Trial, SessionResult, LevelConfig } from '@/types';
import { generateSequence } from '@/lib/game/sequenceGenerator';
import { calculateStats, calculateCombinedAccuracy } from '@/lib/game/scorer';
import { LEVELS } from '@/lib/game/levelConfig';

type GameState = 'idle' | 'briefing' | 'countdown' | 'playing' | 'paused' | 'results';

interface GameStore {
  // State
  gameState: GameState;
  currentLevel: LevelConfig | null;
  trials: Trial[];
  currentTrialIndex: number;
  sessionStartTime: Date | null;

  // Actions
  initializeSession: (levelId: string) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  advanceToNextTrial: () => void;
  recordResponse: (type: 'position' | 'audio', response: boolean) => void;
  endSession: () => SessionResult | null;
  resetGame: () => void;

  // Computed
  getCurrentTrial: () => Trial | null;
  getSessionProgress: () => number;
  isSessionComplete: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  gameState: 'idle',
  currentLevel: null,
  trials: [],
  currentTrialIndex: 0,
  sessionStartTime: null,

  // Actions
  initializeSession: (levelId: string) => {
    const level = LEVELS[levelId];
    if (!level) {
      console.error(`Level ${levelId} not found`);
      return;
    }

    const trials = generateSequence({
      nBack: level.nBack,
      mode: level.mode,
      trialCount: level.defaultTrials,
    });

    set({
      gameState: 'briefing',
      currentLevel: level,
      trials,
      currentTrialIndex: 0,
      sessionStartTime: null,
    });
  },

  startSession: () => {
    set({
      gameState: 'countdown',
      sessionStartTime: new Date(),
    });

    // After countdown, set to playing
    setTimeout(() => {
      set({ gameState: 'playing' });
    }, 3000); // 3 second countdown
  },

  pauseSession: () => {
    set({ gameState: 'paused' });
  },

  resumeSession: () => {
    set({ gameState: 'playing' });
  },

  advanceToNextTrial: () => {
    const { currentTrialIndex, trials } = get();

    if (currentTrialIndex >= trials.length - 1) {
      set({ gameState: 'results' });
    } else {
      set({ currentTrialIndex: currentTrialIndex + 1 });
    }
  },

  recordResponse: (type: 'position' | 'audio', response: boolean) => {
    const { currentTrialIndex, trials } = get();
    const updatedTrials = [...trials];

    if (type === 'position') {
      updatedTrials[currentTrialIndex] = {
        ...updatedTrials[currentTrialIndex],
        userPositionResponse: response,
        responseTime: Date.now(), // Could be more precise
      };
    } else {
      updatedTrials[currentTrialIndex] = {
        ...updatedTrials[currentTrialIndex],
        userAudioResponse: response,
      };
    }

    set({ trials: updatedTrials });
  },

  endSession: () => {
    const { currentLevel, trials, sessionStartTime } = get();

    if (!currentLevel || !sessionStartTime) return null;

    const positionStats = calculateStats(trials, 'position');
    const audioStats = calculateStats(trials, 'audio');
    const combinedAccuracy = calculateCombinedAccuracy(
      positionStats,
      audioStats,
      currentLevel.mode
    );

    const result: SessionResult = {
      sessionId: crypto.randomUUID(),
      levelId: currentLevel.id,
      timestamp: sessionStartTime,
      trials,
      positionStats,
      audioStats,
      combinedAccuracy,
    };

    set({ gameState: 'results' });

    return result;
  },

  resetGame: () => {
    set({
      gameState: 'idle',
      currentLevel: null,
      trials: [],
      currentTrialIndex: 0,
      sessionStartTime: null,
    });
  },

  // Computed
  getCurrentTrial: () => {
    const { trials, currentTrialIndex } = get();
    return trials[currentTrialIndex] ?? null;
  },

  getSessionProgress: () => {
    const { currentTrialIndex, trials } = get();
    return trials.length > 0 ? ((currentTrialIndex + 1) / trials.length) * 100 : 0;
  },

  isSessionComplete: () => {
    const { currentTrialIndex, trials } = get();
    return currentTrialIndex >= trials.length - 1;
  },
}));
```

### Create `src/stores/settingsStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types';

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  trialDuration: 3000,
  sessionLength: 25,
  adaptiveMode: false,
  showHistoryHelper: true,
  showBriefing: true,
  soundEnabled: true,
  volume: 0.8,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'neuralift-settings',
    }
  )
);
```

---

## Audio System

### Create `src/lib/audio/audioManager.ts`

```typescript
import { Howl, Howler } from 'howler';
import { AUDIO_LETTERS } from '@/lib/game/levelConfig';

class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    // Preload all letter sounds
    const loadPromises = AUDIO_LETTERS.map((letter) => {
      return new Promise<void>((resolve, reject) => {
        const sound = new Howl({
          src: [`/audio/letters/${letter.toLowerCase()}.mp3`],
          preload: true,
          onload: () => resolve(),
          onloaderror: (_, error) => {
            console.error(`Failed to load audio for letter ${letter}:`, error);
            resolve(); // Don't fail completely if one letter fails
          },
        });
        this.sounds.set(letter, sound);
      });
    });

    // Load feedback sounds
    const feedbackSounds = ['correct', 'incorrect', 'tick'];
    feedbackSounds.forEach((name) => {
      const sound = new Howl({
        src: [`/audio/feedback/${name}.mp3`],
        preload: true,
      });
      this.sounds.set(name, sound);
    });

    await Promise.all(loadPromises);
    this.isInitialized = true;
  }

  playLetter(letter: string) {
    const sound = this.sounds.get(letter.toUpperCase());
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound for letter ${letter} not found`);
    }
  }

  playFeedback(type: 'correct' | 'incorrect' | 'tick') {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.play();
    }
  }

  setVolume(volume: number) {
    Howler.volume(Math.max(0, Math.min(1, volume)));
  }

  mute() {
    Howler.mute(true);
  }

  unmute() {
    Howler.mute(false);
  }

  // Cleanup
  destroy() {
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioManager = new AudioManager();
```

### Create `src/hooks/useAudio.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { audioManager } from '@/lib/audio/audioManager';
import { useSettingsStore } from '@/stores/settingsStore';

export function useAudio() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    audioManager.initialize();

    return () => {
      // Don't destroy on unmount to keep sounds cached
    };
  }, []);

  useEffect(() => {
    audioManager.setVolume(settings.volume);
    if (settings.soundEnabled) {
      audioManager.unmute();
    } else {
      audioManager.mute();
    }
  }, [settings.soundEnabled, settings.volume]);

  const playLetter = useCallback((letter: string) => {
    if (settings.soundEnabled) {
      audioManager.playLetter(letter);
    }
  }, [settings.soundEnabled]);

  const playFeedback = useCallback((type: 'correct' | 'incorrect' | 'tick') => {
    if (settings.soundEnabled) {
      audioManager.playFeedback(type);
    }
  }, [settings.soundEnabled]);

  return { playLetter, playFeedback };
}
```

---

## Data Persistence

### Create `src/lib/storage/db.ts`

```typescript
import Dexie, { type Table } from 'dexie';
import type { SessionResult, UserProgress } from '@/types';

class NeuraliftDB extends Dexie {
  sessions!: Table<SessionResult>;
  progress!: Table<UserProgress>;

  constructor() {
    super('neuralift');

    this.version(1).stores({
      sessions: 'sessionId, levelId, timestamp',
      progress: 'id', // Single document store
    });
  }
}

export const db = new NeuraliftDB();

// Session operations
export async function saveSession(result: SessionResult): Promise<void> {
  await db.sessions.add(result);
  await updateProgressAfterSession(result);
}

export async function getSessions(levelId?: string): Promise<SessionResult[]> {
  if (levelId) {
    return db.sessions.where('levelId').equals(levelId).reverse().toArray();
  }
  return db.sessions.orderBy('timestamp').reverse().toArray();
}

export async function getRecentSessions(limit: number = 10): Promise<SessionResult[]> {
  return db.sessions.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function getSessionsByDateRange(
  start: Date,
  end: Date
): Promise<SessionResult[]> {
  return db.sessions
    .where('timestamp')
    .between(start, end)
    .toArray();
}

// Progress operations
export async function getProgress(): Promise<UserProgress> {
  const progress = await db.progress.get('user');

  if (!progress) {
    const defaultProgress: UserProgress = {
      currentLevel: 'position-1back',
      completedLevels: [],
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
    };
    await db.progress.add({ id: 'user', ...defaultProgress });
    return defaultProgress;
  }

  return progress;
}

async function updateProgressAfterSession(result: SessionResult): Promise<void> {
  const progress = await getProgress();

  // Update session count
  progress.totalSessions++;

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (progress.lastSessionDate) {
    const lastDate = new Date(progress.lastSessionDate);
    lastDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      progress.currentStreak++;
    } else if (daysDiff > 1) {
      progress.currentStreak = 1;
    }
    // daysDiff === 0 means same day, don't change streak
  } else {
    progress.currentStreak = 1;
  }

  progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
  progress.lastSessionDate = new Date();

  // Check for level completion
  if (result.combinedAccuracy >= 0.7) {
    if (!progress.completedLevels.includes(result.levelId)) {
      progress.completedLevels.push(result.levelId);
    }
  }

  await db.progress.put({ id: 'user', ...progress });
}

export async function clearAllData(): Promise<void> {
  await db.sessions.clear();
  await db.progress.clear();
}
```

---

## Custom Hooks

### Create `src/hooks/useGame.ts`

```typescript
import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useAudio } from './useAudio';
import { saveSession } from '@/lib/storage/db';

export function useGame() {
  const store = useGameStore();
  const { playLetter, playFeedback } = useAudio();
  const trialTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrial = store.getCurrentTrial();

  // Play audio when trial changes
  useEffect(() => {
    if (store.gameState === 'playing' && currentTrial) {
      playLetter(currentTrial.audioLetter);

      // Set timer for next trial
      if (store.currentLevel) {
        trialTimerRef.current = setTimeout(() => {
          store.advanceToNextTrial();
        }, store.currentLevel.trialDuration);
      }
    }

    return () => {
      if (trialTimerRef.current) {
        clearTimeout(trialTimerRef.current);
      }
    };
  }, [store.currentTrialIndex, store.gameState]);

  const handlePositionMatch = useCallback(() => {
    if (store.gameState !== 'playing') return;

    store.recordResponse('position', true);

    // Provide immediate feedback
    if (currentTrial?.isPositionMatch) {
      playFeedback('correct');
    } else {
      playFeedback('incorrect');
    }
  }, [store.gameState, currentTrial]);

  const handleAudioMatch = useCallback(() => {
    if (store.gameState !== 'playing') return;

    store.recordResponse('audio', true);

    if (currentTrial?.isAudioMatch) {
      playFeedback('correct');
    } else {
      playFeedback('incorrect');
    }
  }, [store.gameState, currentTrial]);

  const finishSession = useCallback(async () => {
    const result = store.endSession();
    if (result) {
      await saveSession(result);
      return result;
    }
    return null;
  }, []);

  return {
    ...store,
    currentTrial,
    handlePositionMatch,
    handleAudioMatch,
    finishSession,
  };
}
```

### Create `src/hooks/useKeyboard.ts`

```typescript
import { useEffect, useCallback } from 'react';

interface KeyboardHandlers {
  onPositionMatch?: () => void;
  onAudioMatch?: () => void;
  onPause?: () => void;
  onEscape?: () => void;
}

export function useKeyboard({
  onPositionMatch,
  onAudioMatch,
  onPause,
  onEscape,
}: KeyboardHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'a':
          event.preventDefault();
          onPositionMatch?.();
          break;
        case 'l':
          event.preventDefault();
          onAudioMatch?.();
          break;
        case ' ':
          event.preventDefault();
          onPause?.();
          break;
        case 'escape':
          onEscape?.();
          break;
      }
    },
    [onPositionMatch, onAudioMatch, onPause, onEscape]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

---

## User Analytics & Interaction Tracking System

This system captures ALL user interactions to build comprehensive behavioral profiles that power LLM-driven recommendations and real-time feedback.

### Event Type Definitions

```typescript
// src/types/analytics.ts

// ==========================================
// EVENT CATEGORIES
// ==========================================

export type EventCategory =
  | 'session'      // Training session events
  | 'trial'        // Individual trial events
  | 'navigation'   // Page/route changes
  | 'interaction'  // UI interactions (clicks, hovers)
  | 'settings'     // Settings changes
  | 'help'         // Help system usage
  | 'performance'  // Performance milestones
  | 'engagement';  // Engagement patterns

// ==========================================
// BASE EVENT STRUCTURE
// ==========================================

export interface BaseEvent {
  id: string;
  timestamp: Date;
  category: EventCategory;
  action: string;
  sessionId?: string;       // Training session context
  browserSessionId: string; // Browser session for grouping
}

// ==========================================
// SESSION EVENTS
// ==========================================

export interface SessionEvent extends BaseEvent {
  category: 'session';
  action:
    | 'session_started'
    | 'session_completed'
    | 'session_abandoned'
    | 'session_paused'
    | 'session_resumed';
  data: {
    levelId: string;
    nBack: number;
    mode: TrainingMode;
    trialCount: number;
    duration?: number;        // Total time in ms
    completionRate?: number;  // % of trials completed
    reason?: string;          // For abandoned sessions
  };
}

// ==========================================
// TRIAL EVENTS (Granular Response Tracking)
// ==========================================

export interface TrialEvent extends BaseEvent {
  category: 'trial';
  action:
    | 'trial_presented'
    | 'position_response'
    | 'audio_response'
    | 'trial_timeout'
    | 'trial_completed';
  data: {
    trialIndex: number;
    position: number;
    audioLetter: string;
    isPositionMatch: boolean;
    isAudioMatch: boolean;
    userPositionResponse?: boolean | null;
    userAudioResponse?: boolean | null;
    positionResponseTime?: number;  // ms from stimulus
    audioResponseTime?: number;     // ms from stimulus
    positionCorrect?: boolean;
    audioCorrect?: boolean;
    confidenceIndicator?: 'fast' | 'normal' | 'slow' | 'timeout';
  };
}

// ==========================================
// NAVIGATION EVENTS
// ==========================================

export interface NavigationEvent extends BaseEvent {
  category: 'navigation';
  action:
    | 'page_view'
    | 'page_exit'
    | 'route_change';
  data: {
    fromPath?: string;
    toPath: string;
    timeOnPage?: number;  // ms spent on previous page
    referrer?: string;
  };
}

// ==========================================
// INTERACTION EVENTS
// ==========================================

export interface InteractionEvent extends BaseEvent {
  category: 'interaction';
  action:
    | 'button_click'
    | 'button_hover'
    | 'level_selected'
    | 'level_hover'
    | 'settings_opened'
    | 'results_expanded'
    | 'history_helper_toggled'
    | 'keyboard_shortcut_used'
    | 'touch_gesture';
  data: {
    elementId?: string;
    elementType?: string;
    elementLabel?: string;
    value?: string | number | boolean;
    coordinates?: { x: number; y: number };
  };
}

// ==========================================
// SETTINGS EVENTS
// ==========================================

export interface SettingsEvent extends BaseEvent {
  category: 'settings';
  action:
    | 'setting_changed'
    | 'settings_reset';
  data: {
    setting: string;
    previousValue: any;
    newValue: any;
  };
}

// ==========================================
// HELP SYSTEM EVENTS
// ==========================================

export interface HelpEvent extends BaseEvent {
  category: 'help';
  action:
    | 'popover_opened'
    | 'popover_closed'
    | 'popover_link_clicked'
    | 'tutorial_started'
    | 'tutorial_step_viewed'
    | 'tutorial_completed'
    | 'tutorial_skipped'
    | 'learn_more_opened'
    | 'quick_help_accessed';
  data: {
    contentKey?: string;
    stepIndex?: number;
    totalSteps?: number;
    timeViewed?: number;  // ms popover was open
  };
}

// ==========================================
// PERFORMANCE MILESTONE EVENTS
// ==========================================

export interface PerformanceEvent extends BaseEvent {
  category: 'performance';
  action:
    | 'level_unlocked'
    | 'level_mastered'
    | 'personal_best'
    | 'streak_milestone'
    | 'accuracy_milestone'
    | 'session_count_milestone';
  data: {
    milestone: string;
    value: number;
    previousBest?: number;
    levelId?: string;
  };
}

// ==========================================
// ENGAGEMENT PATTERN EVENTS
// ==========================================

export interface EngagementEvent extends BaseEvent {
  category: 'engagement';
  action:
    | 'app_opened'
    | 'app_closed'
    | 'app_backgrounded'
    | 'app_foregrounded'
    | 'idle_detected'
    | 'return_from_idle';
  data: {
    idleDuration?: number;
    totalSessionTime?: number;
    dayOfWeek?: number;
    hourOfDay?: number;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
  };
}

// Union type for all events
export type AnalyticsEvent =
  | SessionEvent
  | TrialEvent
  | NavigationEvent
  | InteractionEvent
  | SettingsEvent
  | HelpEvent
  | PerformanceEvent
  | EngagementEvent;
```

---

### User Behavioral Profile

```typescript
// src/types/userProfile.ts

export interface UserBehavioralProfile {
  id: string;
  lastUpdated: Date;

  // ==========================================
  // PERFORMANCE PATTERNS
  // ==========================================
  performance: {
    // Overall metrics
    averageAccuracy: number;
    accuracyTrend: 'improving' | 'stable' | 'declining';
    accuracyByLevel: Record<string, number>;

    // Modality strengths
    positionStrength: number;      // 0-100 score
    audioStrength: number;         // 0-100 score
    dualTaskPenalty: number;       // Accuracy drop in dual vs single

    // Response patterns
    averageResponseTime: number;
    responseTimeConsistency: number; // Lower = more consistent
    fastResponseAccuracy: number;    // Accuracy when responding quickly
    slowResponseAccuracy: number;    // Accuracy when responding slowly

    // Error patterns
    falseAlarmRate: number;
    missRate: number;
    errorPatternType: 'conservative' | 'liberal' | 'balanced';

    // Fatigue indicators
    earlySessionAccuracy: number;   // First 25% of trials
    lateSessionAccuracy: number;    // Last 25% of trials
    fatigueDropoff: number;         // Percentage decline
    optimalSessionLength: number;   // Trials before performance drops
  };

  // ==========================================
  // LEARNING PATTERNS
  // ==========================================
  learning: {
    // Progression speed
    levelProgressionRate: number;   // Days per level average
    currentPlateauDuration: number; // Days at current level
    isPlateaued: boolean;

    // Learning style indicators
    benefitsFromHelper: boolean;    // Better with history helper
    benefitsFromBriefing: boolean;  // Better after viewing briefing
    learningVelocity: 'fast' | 'moderate' | 'gradual';

    // Struggle areas
    strugglingWithLevel?: string;
    sessionsAtCurrentLevel: number;
    recentAccuracyTrend: number[];  // Last 10 sessions
  };

  // ==========================================
  // ENGAGEMENT PATTERNS
  // ==========================================
  engagement: {
    // Session habits
    totalSessions: number;
    averageSessionsPerWeek: number;
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    preferredDayOfWeek: number[];   // 0-6
    averageSessionDuration: number; // minutes

    // Consistency
    currentStreak: number;
    longestStreak: number;
    streakConsistency: number;      // 0-100
    daysActive: number;
    daysSinceFirstSession: number;

    // Retention indicators
    returnRate: number;             // % of days returning after first session
    churnRisk: 'low' | 'medium' | 'high';
    lastActiveDate: Date;

    // Feature usage
    usesKeyboardShortcuts: boolean;
    usesHistoryHelper: boolean;
    viewsResultsDetail: boolean;
    checksProgress: boolean;
  };

  // ==========================================
  // HELP-SEEKING BEHAVIOR
  // ==========================================
  helpBehavior: {
    popoverViewCount: number;
    averagePopoverTime: number;
    tutorialCompleted: boolean;
    tutorialSkipped: boolean;
    helpSeekingFrequency: 'never' | 'rarely' | 'sometimes' | 'often';
    topViewedHelpTopics: string[];
  };

  // ==========================================
  // COMPUTED INSIGHTS
  // ==========================================
  insights: {
    primaryStrength: string;
    primaryWeakness: string;
    recommendedFocus: string;
    motivationType: 'achievement' | 'mastery' | 'social' | 'habit';
    riskOfChurn: number;            // 0-100
    readyForAdvancement: boolean;
    suggestedLevel: string;
  };
}
```

---

### Analytics Tracking Service

```typescript
// src/lib/analytics/tracker.ts

import { nanoid } from 'nanoid';
import type { AnalyticsEvent, EventCategory } from '@/types/analytics';
import { db } from '@/lib/storage/db';

class AnalyticsTracker {
  private browserSessionId: string;
  private currentTrainingSessionId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    this.browserSessionId = this.getOrCreateBrowserSessionId();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  initialize() {
    if (this.isInitialized) return;

    // Flush events every 10 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 10000);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushEvents(true);
      });

      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.track('engagement', 'app_backgrounded', {});
          this.flushEvents(true);
        } else {
          this.track('engagement', 'app_foregrounded', {});
        }
      });
    }

    this.isInitialized = true;
    this.track('engagement', 'app_opened', {
      deviceType: this.getDeviceType(),
      dayOfWeek: new Date().getDay(),
      hourOfDay: new Date().getHours(),
    });
  }

  // ==========================================
  // CORE TRACKING METHOD
  // ==========================================

  track<T extends EventCategory>(
    category: T,
    action: string,
    data: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      id: nanoid(),
      timestamp: new Date(),
      category,
      action,
      sessionId: this.currentTrainingSessionId ?? undefined,
      browserSessionId: this.browserSessionId,
      data,
    } as AnalyticsEvent;

    this.eventQueue.push(event);

    // Immediately flush critical events
    if (this.isCriticalEvent(category, action)) {
      this.flushEvents();
    }
  }

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  setTrainingSession(sessionId: string | null) {
    this.currentTrainingSessionId = sessionId;
  }

  // ==========================================
  // SPECIALIZED TRACKING METHODS
  // ==========================================

  // Trial-level tracking with precise timing
  trackTrialResponse(data: {
    trialIndex: number;
    position: number;
    audioLetter: string;
    isPositionMatch: boolean;
    isAudioMatch: boolean;
    responseType: 'position' | 'audio';
    userResponse: boolean;
    responseTime: number;
    stimulusTime: number;
  }) {
    const latency = data.responseTime - data.stimulusTime;
    const confidenceIndicator = this.getConfidenceIndicator(latency);
    const isCorrect = data.responseType === 'position'
      ? data.userResponse === data.isPositionMatch
      : data.userResponse === data.isAudioMatch;

    this.track('trial', `${data.responseType}_response`, {
      trialIndex: data.trialIndex,
      position: data.position,
      audioLetter: data.audioLetter,
      isPositionMatch: data.isPositionMatch,
      isAudioMatch: data.isAudioMatch,
      [`user${data.responseType.charAt(0).toUpperCase() + data.responseType.slice(1)}Response`]: data.userResponse,
      [`${data.responseType}ResponseTime`]: latency,
      [`${data.responseType}Correct`]: isCorrect,
      confidenceIndicator,
    });
  }

  trackNavigation(fromPath: string | null, toPath: string, timeOnPage?: number) {
    this.track('navigation', 'route_change', {
      fromPath,
      toPath,
      timeOnPage,
    });
  }

  trackInteraction(
    action: string,
    elementId: string,
    elementType: string,
    additionalData?: Record<string, any>
  ) {
    this.track('interaction', action, {
      elementId,
      elementType,
      ...additionalData,
    });
  }

  trackSettingChange(setting: string, previousValue: any, newValue: any) {
    this.track('settings', 'setting_changed', {
      setting,
      previousValue,
      newValue,
    });
  }

  trackHelpInteraction(action: string, contentKey?: string, additionalData?: Record<string, any>) {
    this.track('help', action, {
      contentKey,
      ...additionalData,
    });
  }

  trackPerformanceMilestone(milestone: string, value: number, additionalData?: Record<string, any>) {
    this.track('performance', milestone as any, {
      milestone,
      value,
      ...additionalData,
    });
  }

  // ==========================================
  // PERSISTENCE
  // ==========================================

  private async flushEvents(sync = false) {
    if (this.eventQueue.length === 0) return;

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await db.analyticsEvents.bulkAdd(eventsToFlush);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-queue failed events
      this.eventQueue = [...eventsToFlush, ...this.eventQueue];
    }
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  private getOrCreateBrowserSessionId(): string {
    if (typeof window === 'undefined') return nanoid();

    let sessionId = sessionStorage.getItem('browserSessionId');
    if (!sessionId) {
      sessionId = nanoid();
      sessionStorage.setItem('browserSessionId', sessionId);
    }
    return sessionId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConfidenceIndicator(responseTime: number): 'fast' | 'normal' | 'slow' | 'timeout' {
    if (responseTime < 500) return 'fast';
    if (responseTime < 1500) return 'normal';
    if (responseTime < 2500) return 'slow';
    return 'timeout';
  }

  private isCriticalEvent(category: EventCategory, action: string): boolean {
    return (
      category === 'session' ||
      category === 'performance' ||
      action === 'tutorial_completed' ||
      action === 'level_unlocked'
    );
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents(true);
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker();
```

---

### User Profile Builder

```typescript
// src/lib/analytics/profileBuilder.ts

import type { UserBehavioralProfile } from '@/types/userProfile';
import type { AnalyticsEvent, TrialEvent, SessionEvent } from '@/types/analytics';
import type { SessionResult } from '@/types';
import { db } from '@/lib/storage/db';

export async function buildUserProfile(): Promise<UserBehavioralProfile> {
  const [events, sessions, progress] = await Promise.all([
    db.analyticsEvents.toArray(),
    db.sessions.toArray(),
    db.progress.get('user'),
  ]);

  const profile: UserBehavioralProfile = {
    id: 'user',
    lastUpdated: new Date(),
    performance: await analyzePerformance(sessions, events),
    learning: await analyzeLearning(sessions, progress),
    engagement: await analyzeEngagement(events, sessions, progress),
    helpBehavior: analyzeHelpBehavior(events),
    insights: {} as any, // Computed below
  };

  profile.insights = generateInsights(profile);

  return profile;
}

async function analyzePerformance(
  sessions: SessionResult[],
  events: AnalyticsEvent[]
): Promise<UserBehavioralProfile['performance']> {
  if (sessions.length === 0) {
    return getDefaultPerformance();
  }

  const recentSessions = sessions.slice(-20);
  const trialEvents = events.filter(e => e.category === 'trial') as TrialEvent[];

  // Calculate accuracy trends
  const accuracies = recentSessions.map(s => s.combinedAccuracy);
  const accuracyTrend = calculateTrend(accuracies);

  // Modality analysis
  const positionAccuracies = recentSessions.map(s => s.positionStats.accuracy);
  const audioAccuracies = recentSessions.map(s => s.audioStats.accuracy);
  const positionStrength = average(positionAccuracies) * 100;
  const audioStrength = average(audioAccuracies) * 100;

  // Response time analysis
  const responseTimes = trialEvents
    .filter(e => e.data.positionResponseTime || e.data.audioResponseTime)
    .map(e => e.data.positionResponseTime || e.data.audioResponseTime)
    .filter(Boolean) as number[];

  const avgResponseTime = average(responseTimes);
  const responseTimeStdDev = standardDeviation(responseTimes);

  // Error pattern analysis
  const totalFalseAlarms = sum(recentSessions.map(s =>
    s.positionStats.falseAlarms + s.audioStats.falseAlarms
  ));
  const totalMisses = sum(recentSessions.map(s =>
    s.positionStats.misses + s.audioStats.misses
  ));
  const errorPatternType = totalFalseAlarms > totalMisses * 1.5
    ? 'liberal'
    : totalMisses > totalFalseAlarms * 1.5
      ? 'conservative'
      : 'balanced';

  // Fatigue analysis
  const { earlyAccuracy, lateAccuracy } = analyzeFatigue(trialEvents);

  return {
    averageAccuracy: average(accuracies),
    accuracyTrend,
    accuracyByLevel: groupAccuracyByLevel(sessions),
    positionStrength,
    audioStrength,
    dualTaskPenalty: calculateDualTaskPenalty(sessions),
    averageResponseTime: avgResponseTime,
    responseTimeConsistency: responseTimeStdDev,
    fastResponseAccuracy: calculateAccuracyBySpeed(trialEvents, 'fast'),
    slowResponseAccuracy: calculateAccuracyBySpeed(trialEvents, 'slow'),
    falseAlarmRate: average(recentSessions.map(s =>
      (s.positionStats.falseAlarmRate + s.audioStats.falseAlarmRate) / 2
    )),
    missRate: average(recentSessions.map(s =>
      ((s.positionStats.misses / (s.positionStats.hits + s.positionStats.misses)) +
       (s.audioStats.misses / (s.audioStats.hits + s.audioStats.misses))) / 2
    )),
    errorPatternType,
    earlySessionAccuracy: earlyAccuracy,
    lateSessionAccuracy: lateAccuracy,
    fatigueDropoff: earlyAccuracy - lateAccuracy,
    optimalSessionLength: calculateOptimalSessionLength(trialEvents),
  };
}

async function analyzeLearning(
  sessions: SessionResult[],
  progress: any
): Promise<UserBehavioralProfile['learning']> {
  // Implementation details...
  const levelSessions = groupSessionsByLevel(sessions);
  const accuracyTrend = sessions.slice(-10).map(s => s.combinedAccuracy);

  return {
    levelProgressionRate: calculateProgressionRate(sessions),
    currentPlateauDuration: calculatePlateauDuration(sessions, progress?.currentLevel),
    isPlateaued: accuracyTrend.length >= 5 && standardDeviation(accuracyTrend) < 0.05,
    benefitsFromHelper: true, // Analyze from settings events
    benefitsFromBriefing: true,
    learningVelocity: determineLearningVelocity(sessions),
    strugglingWithLevel: findStrugglingLevel(levelSessions),
    sessionsAtCurrentLevel: levelSessions[progress?.currentLevel]?.length ?? 0,
    recentAccuracyTrend: accuracyTrend,
  };
}

async function analyzeEngagement(
  events: AnalyticsEvent[],
  sessions: SessionResult[],
  progress: any
): Promise<UserBehavioralProfile['engagement']> {
  const engagementEvents = events.filter(e => e.category === 'engagement');
  const interactionEvents = events.filter(e => e.category === 'interaction');

  // Session timing analysis
  const sessionTimes = sessions.map(s => new Date(s.timestamp));
  const preferredHours = sessionTimes.map(d => d.getHours());
  const preferredDays = sessionTimes.map(d => d.getDay());

  return {
    totalSessions: sessions.length,
    averageSessionsPerWeek: calculateWeeklyAverage(sessions),
    preferredTimeOfDay: getPreferredTimeOfDay(preferredHours),
    preferredDayOfWeek: mode(preferredDays),
    averageSessionDuration: calculateAverageSessionDuration(sessions),
    currentStreak: progress?.currentStreak ?? 0,
    longestStreak: progress?.longestStreak ?? 0,
    streakConsistency: calculateStreakConsistency(sessions),
    daysActive: countUniqueDays(sessions),
    daysSinceFirstSession: sessions.length > 0
      ? daysBetween(sessions[0].timestamp, new Date())
      : 0,
    returnRate: calculateReturnRate(sessions),
    churnRisk: determineChurnRisk(sessions, events),
    lastActiveDate: sessions.length > 0
      ? new Date(sessions[sessions.length - 1].timestamp)
      : new Date(),
    usesKeyboardShortcuts: interactionEvents.some(e =>
      e.action === 'keyboard_shortcut_used'
    ),
    usesHistoryHelper: true, // From settings
    viewsResultsDetail: interactionEvents.some(e =>
      e.action === 'results_expanded'
    ),
    checksProgress: events.some(e =>
      e.category === 'navigation' && (e as any).data?.toPath?.includes('progress')
    ),
  };
}

function analyzeHelpBehavior(
  events: AnalyticsEvent[]
): UserBehavioralProfile['helpBehavior'] {
  const helpEvents = events.filter(e => e.category === 'help');

  const popoverEvents = helpEvents.filter(e =>
    e.action === 'popover_opened' || e.action === 'popover_closed'
  );

  const topicCounts: Record<string, number> = {};
  helpEvents.forEach(e => {
    const key = (e as any).data?.contentKey;
    if (key) {
      topicCounts[key] = (topicCounts[key] || 0) + 1;
    }
  });

  return {
    popoverViewCount: popoverEvents.filter(e => e.action === 'popover_opened').length,
    averagePopoverTime: calculateAveragePopoverTime(popoverEvents),
    tutorialCompleted: helpEvents.some(e => e.action === 'tutorial_completed'),
    tutorialSkipped: helpEvents.some(e => e.action === 'tutorial_skipped'),
    helpSeekingFrequency: determineHelpFrequency(helpEvents, events.length),
    topViewedHelpTopics: Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([key]) => key),
  };
}

function generateInsights(
  profile: Omit<UserBehavioralProfile, 'insights'>
): UserBehavioralProfile['insights'] {
  const { performance, learning, engagement } = profile;

  // Determine strengths and weaknesses
  const primaryStrength = performance.positionStrength > performance.audioStrength
    ? 'Spatial/Position Memory'
    : 'Auditory/Verbal Memory';

  const primaryWeakness = performance.positionStrength > performance.audioStrength
    ? 'Auditory Processing'
    : 'Spatial Processing';

  // Determine recommended focus
  let recommendedFocus = '';
  if (performance.fatigueDropoff > 0.15) {
    recommendedFocus = 'Session length - try shorter sessions';
  } else if (performance.errorPatternType === 'liberal') {
    recommendedFocus = 'Accuracy over speed - pause before responding';
  } else if (performance.errorPatternType === 'conservative') {
    recommendedFocus = 'Trust your instincts - respond more confidently';
  } else if (learning.isPlateaued) {
    recommendedFocus = 'Try varying trial duration or session length';
  } else {
    recommendedFocus = `Continue focusing on ${primaryWeakness.toLowerCase()}`;
  }

  // Determine motivation type
  const motivationType = engagement.longestStreak > 14 ? 'habit'
    : engagement.checksProgress ? 'achievement'
    : performance.averageAccuracy > 0.85 ? 'mastery'
    : 'achievement';

  return {
    primaryStrength,
    primaryWeakness,
    recommendedFocus,
    motivationType,
    riskOfChurn: engagement.churnRisk === 'high' ? 80 : engagement.churnRisk === 'medium' ? 50 : 20,
    readyForAdvancement: performance.averageAccuracy >= 0.8 && !learning.isPlateaued,
    suggestedLevel: determineSuggestedLevel(profile),
  };
}

// Helper functions
function average(arr: number[]): number {
  return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function standardDeviation(arr: number[]): number {
  const avg = average(arr);
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

function calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
  if (values.length < 3) return 'stable';
  const firstHalf = average(values.slice(0, Math.floor(values.length / 2)));
  const secondHalf = average(values.slice(Math.floor(values.length / 2)));
  const diff = secondHalf - firstHalf;
  if (diff > 0.05) return 'improving';
  if (diff < -0.05) return 'declining';
  return 'stable';
}

// ... additional helper functions
```

---

### LLM Integration Service

```typescript
// src/lib/llm/llmService.ts

import type { UserBehavioralProfile } from '@/types/userProfile';
import type { SessionResult } from '@/types';

export interface LLMFeedbackRequest {
  type: 'session_feedback' | 'recommendation' | 'motivation' | 'tip';
  userProfile: UserBehavioralProfile;
  context?: {
    currentSession?: SessionResult;
    currentLevel?: string;
    recentSessions?: SessionResult[];
  };
}

export interface LLMFeedbackResponse {
  message: string;
  suggestions?: string[];
  encouragement?: string;
  nextSteps?: string[];
  warningFlags?: string[];
}

class LLMService {
  private apiEndpoint: string;
  private apiKey: string | null = null;

  constructor() {
    this.apiEndpoint = process.env.NEXT_PUBLIC_LLM_API_ENDPOINT || '/api/llm';
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  // ==========================================
  // REAL-TIME SESSION FEEDBACK
  // ==========================================

  async getSessionFeedback(
    session: SessionResult,
    profile: UserBehavioralProfile
  ): Promise<LLMFeedbackResponse> {
    const prompt = this.buildSessionFeedbackPrompt(session, profile);
    return this.callLLM(prompt, 'session_feedback');
  }

  private buildSessionFeedbackPrompt(
    session: SessionResult,
    profile: UserBehavioralProfile
  ): string {
    return `
You are a cognitive training coach providing feedback after a dual n-back training session.

## User Profile Summary
- Experience Level: ${profile.engagement.totalSessions} total sessions
- Primary Strength: ${profile.insights.primaryStrength}
- Primary Weakness: ${profile.insights.primaryWeakness}
- Learning Velocity: ${profile.learning.learningVelocity}
- Current Streak: ${profile.engagement.currentStreak} days
- Accuracy Trend: ${profile.performance.accuracyTrend}
- Error Pattern: ${profile.performance.errorPatternType}
- Fatigue Dropoff: ${(profile.performance.fatigueDropoff * 100).toFixed(1)}%

## This Session Results
- Level: ${session.levelId}
- Combined Accuracy: ${(session.combinedAccuracy * 100).toFixed(1)}%
- Position Accuracy: ${(session.positionStats.accuracy * 100).toFixed(1)}%
- Audio Accuracy: ${(session.audioStats.accuracy * 100).toFixed(1)}%
- Position Hits: ${session.positionStats.hits}/${session.positionStats.hits + session.positionStats.misses}
- Audio Hits: ${session.audioStats.hits}/${session.audioStats.hits + session.audioStats.misses}
- Position False Alarms: ${session.positionStats.falseAlarms}
- Audio False Alarms: ${session.audioStats.falseAlarms}
- D-Prime Position: ${session.positionStats.dPrime.toFixed(2)}
- D-Prime Audio: ${session.audioStats.dPrime.toFixed(2)}

## Instructions
Provide personalized, encouraging feedback in 2-3 sentences. Focus on:
1. Acknowledge specific performance (good or areas to improve)
2. Connect to their known patterns (strengths/weaknesses)
3. Give ONE specific, actionable tip based on their error pattern
4. End with encouragement appropriate to their motivation type (${profile.insights.motivationType})

Keep the tone warm but professional, like a supportive coach. Avoid generic praise.
`.trim();
  }

  // ==========================================
  // TRAINING RECOMMENDATIONS
  // ==========================================

  async getRecommendations(
    profile: UserBehavioralProfile
  ): Promise<LLMFeedbackResponse> {
    const prompt = this.buildRecommendationsPrompt(profile);
    return this.callLLM(prompt, 'recommendation');
  }

  private buildRecommendationsPrompt(profile: UserBehavioralProfile): string {
    return `
You are a cognitive training advisor providing personalized recommendations.

## User Behavioral Profile
${JSON.stringify(profile, null, 2)}

## Instructions
Based on this user's complete behavioral profile, provide:

1. **Primary Recommendation**: One specific training focus for their next session
2. **Level Suggestion**: Should they stay at current level, move up, or consolidate?
3. **Session Optimization**: Suggested trial count and duration based on fatigue patterns
4. **Engagement Tip**: How to maintain their streak/motivation
5. **Long-term Goal**: One achievable milestone to work toward

Format as JSON matching the LLMFeedbackResponse interface.
Consider their:
- Accuracy trends and plateau status
- Fatigue patterns
- Help-seeking behavior
- Preferred training times
- Motivation type
`.trim();
  }

  // ==========================================
  // REAL-TIME TIPS (During Session)
  // ==========================================

  async getInSessionTip(
    profile: UserBehavioralProfile,
    recentTrialPerformance: { correct: number; total: number; type: 'position' | 'audio' }[]
  ): Promise<string> {
    // Quick, lightweight tip based on recent performance
    const recentAccuracy = recentTrialPerformance.reduce(
      (acc, t) => acc + t.correct / t.total, 0
    ) / recentTrialPerformance.length;

    if (recentAccuracy < 0.5) {
      if (profile.performance.errorPatternType === 'liberal') {
        return "Slow down—take a breath between trials to confirm the match.";
      } else {
        return "Trust your first instinct more. If it feels like a match, respond!";
      }
    }

    return ""; // No tip needed when performing well
  }

  // ==========================================
  // MOTIVATIONAL MESSAGES
  // ==========================================

  async getMotivationalMessage(
    profile: UserBehavioralProfile,
    trigger: 'streak_risk' | 'plateau' | 'milestone' | 'return'
  ): Promise<string> {
    const prompts: Record<string, string> = {
      streak_risk: `User has a ${profile.engagement.currentStreak}-day streak at risk. Their motivation type is ${profile.insights.motivationType}. Write a brief, personalized message to encourage them to train today.`,
      plateau: `User has been plateaued for ${profile.learning.currentPlateauDuration} days at ${profile.learning.strugglingWithLevel}. Write an encouraging message with a specific suggestion to break through.`,
      milestone: `User just achieved a milestone. Their motivation type is ${profile.insights.motivationType}. Write a celebration message.`,
      return: `User is returning after ${daysSince(profile.engagement.lastActiveDate)} days away. Write a warm welcome-back message.`,
    };

    const response = await this.callLLM(prompts[trigger], 'motivation');
    return response.message;
  }

  // ==========================================
  // API CALL
  // ==========================================

  private async callLLM(
    prompt: string,
    type: LLMFeedbackRequest['type']
  ): Promise<LLMFeedbackResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({ prompt, type }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LLM service error:', error);
      return this.getFallbackResponse(type);
    }
  }

  private getFallbackResponse(type: LLMFeedbackRequest['type']): LLMFeedbackResponse {
    // Fallback responses when LLM is unavailable
    const fallbacks: Record<string, LLMFeedbackResponse> = {
      session_feedback: {
        message: "Great effort on completing this session! Keep practicing to build those neural pathways.",
        suggestions: ["Try to maintain a consistent rhythm", "Focus on your breathing"],
      },
      recommendation: {
        message: "Continue with your current level to build consistency.",
        nextSteps: ["Complete 2-3 more sessions at this level"],
      },
      motivation: {
        message: "Every session counts toward building a stronger mind!",
      },
      tip: {
        message: "Stay relaxed and trust your instincts.",
      },
    };

    return fallbacks[type] || { message: "Keep up the great work!" };
  }
}

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

// Singleton instance
export const llmService = new LLMService();
```

---

### LLM API Route

```typescript
// src/app/api/llm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    const systemPrompt = getSystemPrompt(type);

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Fast, cost-effective for real-time feedback
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse response based on type
    const parsed = parseResponse(content.text, type);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

function getSystemPrompt(type: string): string {
  const prompts: Record<string, string> = {
    session_feedback: `You are a supportive cognitive training coach. Provide brief, personalized feedback after training sessions. Be encouraging but specific. Keep responses under 100 words.`,
    recommendation: `You are a cognitive training advisor. Analyze user data and provide actionable recommendations. Be specific and practical. Return valid JSON.`,
    motivation: `You are a motivational coach for cognitive training. Write brief, personalized messages that inspire continued practice. Match the user's motivation style.`,
    tip: `You are a cognitive training expert. Provide one specific, actionable tip. Keep it under 20 words.`,
  };

  return prompts[type] || prompts.session_feedback;
}

function parseResponse(text: string, type: string): any {
  if (type === 'recommendation') {
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  return { message: text };
}
```

---

### Analytics React Hooks

```typescript
// src/hooks/useAnalytics.ts

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics/tracker';

export function useAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);
  const pageLoadTime = useRef<number>(Date.now());

  // Initialize analytics
  useEffect(() => {
    analytics.initialize();
  }, []);

  // Track page views
  useEffect(() => {
    const timeOnPreviousPage = previousPath.current
      ? Date.now() - pageLoadTime.current
      : undefined;

    analytics.trackNavigation(previousPath.current, pathname, timeOnPreviousPage);

    previousPath.current = pathname;
    pageLoadTime.current = Date.now();
  }, [pathname]);

  // Interaction tracking
  const trackClick = useCallback((
    elementId: string,
    elementType: string,
    additionalData?: Record<string, any>
  ) => {
    analytics.trackInteraction('button_click', elementId, elementType, additionalData);
  }, []);

  const trackHover = useCallback((
    elementId: string,
    elementType: string
  ) => {
    analytics.trackInteraction('button_hover', elementId, elementType);
  }, []);

  return {
    trackClick,
    trackHover,
    trackSettingChange: analytics.trackSettingChange.bind(analytics),
    trackHelpInteraction: analytics.trackHelpInteraction.bind(analytics),
    trackPerformanceMilestone: analytics.trackPerformanceMilestone.bind(analytics),
    setTrainingSession: analytics.setTrainingSession.bind(analytics),
  };
}

// src/hooks/useLLMFeedback.ts

import { useState, useCallback } from 'react';
import { llmService } from '@/lib/llm/llmService';
import { buildUserProfile } from '@/lib/analytics/profileBuilder';
import type { SessionResult } from '@/types';
import type { LLMFeedbackResponse } from '@/lib/llm/llmService';

export function useLLMFeedback() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<LLMFeedbackResponse | null>(null);

  const getSessionFeedback = useCallback(async (session: SessionResult) => {
    setLoading(true);
    try {
      const profile = await buildUserProfile();
      const response = await llmService.getSessionFeedback(session, profile);
      setFeedback(response);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await buildUserProfile();
      const response = await llmService.getRecommendations(profile);
      setFeedback(response);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    feedback,
    getSessionFeedback,
    getRecommendations,
    clearFeedback: () => setFeedback(null),
  };
}
```

---

### Updated Database Schema

```typescript
// src/lib/storage/db.ts (updated)

import Dexie, { type Table } from 'dexie';
import type { SessionResult, UserProgress } from '@/types';
import type { AnalyticsEvent } from '@/types/analytics';
import type { UserBehavioralProfile } from '@/types/userProfile';

class NeuraliftDB extends Dexie {
  sessions!: Table<SessionResult>;
  progress!: Table<UserProgress>;
  analyticsEvents!: Table<AnalyticsEvent>;
  userProfile!: Table<UserBehavioralProfile>;

  constructor() {
    super('neuralift');

    this.version(2).stores({
      sessions: 'sessionId, levelId, timestamp',
      progress: 'id',
      analyticsEvents: 'id, category, action, timestamp, sessionId, browserSessionId',
      userProfile: 'id, lastUpdated',
    });
  }
}

export const db = new NeuraliftDB();

// Analytics event operations
export async function getEventsByCategory(category: string): Promise<AnalyticsEvent[]> {
  return db.analyticsEvents.where('category').equals(category).toArray();
}

export async function getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]> {
  return db.analyticsEvents.where('sessionId').equals(sessionId).toArray();
}

export async function getRecentEvents(limit: number = 100): Promise<AnalyticsEvent[]> {
  return db.analyticsEvents.orderBy('timestamp').reverse().limit(limit).toArray();
}

// Profile operations
export async function saveUserProfile(profile: UserBehavioralProfile): Promise<void> {
  await db.userProfile.put(profile);
}

export async function getUserProfile(): Promise<UserBehavioralProfile | undefined> {
  return db.userProfile.get('user');
}
```

---

## Deliverables Checklist

- [ ] Level configurations defined for all training levels
- [ ] Sequence generation algorithm implemented
- [ ] Scoring system with d-prime calculation
- [ ] Zustand game store with all actions
- [ ] Zustand settings store with persistence
- [ ] Audio manager with preloading
- [ ] IndexedDB schema and operations
- [ ] useGame hook for game orchestration
- [ ] useAudio hook for sound management
- [ ] useKeyboard hook for keyboard controls
- [ ] All audio files placeholder locations defined
- [ ] **Analytics event type definitions**
- [ ] **User behavioral profile type definitions**
- [ ] **Analytics tracker service**
- [ ] **User profile builder**
- [ ] **LLM integration service**
- [ ] **LLM API route**
- [ ] **useAnalytics hook**
- [ ] **useLLMFeedback hook**
- [ ] **Updated database schema for events**

---

## Success Criteria

1. Sequence generator produces valid n-back sequences
2. Scoring correctly calculates hits, misses, false alarms
3. D-prime calculation produces reasonable values
4. State transitions work correctly (idle → briefing → playing → results)
5. Audio plays on trial start
6. Sessions persist to IndexedDB
7. Keyboard shortcuts trigger correct actions
8. Settings persist across browser sessions
9. **All user interactions generate analytics events**
10. **Events persist to IndexedDB and can be queried**
11. **User profile builds correctly from event data**
12. **LLM API responds with personalized feedback**
13. **Fallback responses work when LLM is unavailable**
14. **Response times are tracked at millisecond precision**

---

## Audio Assets Required

Create placeholder structure:
```
public/
├── audio/
│   ├── letters/
│   │   ├── c.mp3
│   │   ├── h.mp3
│   │   ├── k.mp3
│   │   ├── l.mp3
│   │   ├── q.mp3
│   │   ├── r.mp3
│   │   ├── s.mp3
│   │   └── t.mp3
│   └── feedback/
│       ├── correct.mp3
│       ├── incorrect.mp3
│       └── tick.mp3
```

---

## Dependencies for Next Phase

Phase 4 (Page Development) requires:
- Working game state management
- Sequence generation
- Scoring system
- Audio playback
- Data persistence

---

## Notes

- Test sequence generation to ensure reasonable match distribution
- Verify d-prime calculation against known values
- Consider Web Audio API as Howler.js alternative for better performance
- Audio files should be short (~500ms) and clearly distinguishable
- **Analytics events should be batched to avoid performance impact**
- **User profile should be rebuilt periodically (not on every event)**
- **LLM calls should be rate-limited to control costs**
- **Consider caching LLM responses for similar contexts**
- **Add data export feature for user privacy compliance**

---

## Environment Variables Required

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...           # Required for LLM features
NEXT_PUBLIC_LLM_API_ENDPOINT=/api/llm  # Can be customized for external API
```

---

## Data Privacy Considerations

1. **Local-First**: All user data stored locally in IndexedDB
2. **No PII in Events**: Analytics events contain behavioral data only
3. **LLM Data Minimization**: Only send aggregated profile data to LLM, not raw events
4. **User Control**: Provide data export and delete functionality
5. **Transparency**: Inform users about LLM-powered features in onboarding
