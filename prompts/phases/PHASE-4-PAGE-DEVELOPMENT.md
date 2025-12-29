# Phase 4: Page Development

## Overview

Build all application pages and their associated components. This phase implements the complete user interface from landing page through training session to results.

---

## Objectives

1. Build Landing/Home page with user journey visualization
2. Create Training Level Selection page
3. Implement Pre-Session Briefing screen
4. Build Active Training Interface with grid and controls
5. Create Post-Session Results page
6. Implement Settings page
7. Build Progress/Statistics page

---

## Page Architecture

```
src/app/
├── page.tsx                      # Landing / Home
├── train/
│   ├── page.tsx                  # Level Selection
│   └── [levelId]/
│       ├── page.tsx              # Pre-Session Briefing
│       └── session/
│           └── page.tsx          # Active Training
├── results/
│   └── [sessionId]/
│       └── page.tsx              # Post-Session Results
├── progress/
│   └── page.tsx                  # Statistics & History
└── settings/
    └── page.tsx                  # User Settings
```

---

## 1. Landing / Home Page

### File: `src/app/page.tsx`

**Purpose**: Orient new users, provide quick-start for returning users

**Layout Wireframe**:
```
┌──────────────────────────────────────────────────────────────┐
│  ╭─────────────────────────────────────────────────────────╮ │
│  │                    [Animated Logo]                      │ │
│  │                      NEURALIFT                          │ │
│  │              Dual N-Back Training                       │ │
│  ╰─────────────────────────────────────────────────────────╯ │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │   ▶ QUICK START     │  │   📚 LEARN MORE     │           │
│  │   Resume Training   │  │   What is N-Back?   │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  YOUR JOURNEY                                            ││
│  │  ●────●────●────○────○────○────○                         ││
│  │  1.1  1.2  1.3  2.1  2.2  2.3  3.1                       ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  TODAY'S STATS                                          │ │
│  │  Sessions: 2  │  Best: 84%  │  Streak: 7 days 🔥        │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Components Needed**:
- `Logo` - Animated app logo
- `QuickStartCard` - Primary CTA for returning users
- `LearnMoreCard` - Secondary CTA for new users
- `JourneyMap` - Visual progress through training phases
- `TodayStats` - Daily statistics summary

**Key Features**:
- Detect first-time vs returning user
- Show appropriate next level recommendation
- Display streak and motivation data
- Quick access to continue training

---

## 2. Training Level Selection Page

### File: `src/app/train/page.tsx`

**Purpose**: Allow users to select their training level

**Layout Wireframe**:
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back                    CHOOSE YOUR TRAINING                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─ PHASE 1: FOUNDATIONS ────────────────────────────────────┐ │
│  │  ┌─────────────┐  ┌─────────────┐                        │ │
│  │  │  Position   │  │  Position   │                        │ │
│  │  │  1-Back     │  │  2-Back     │                        │ │
│  │  │  ✓ Complete │  │  ✓ Complete │                        │ │
│  │  └─────────────┘  └─────────────┘                        │ │
│  │  ┌─────────────┐  ┌─────────────┐                        │ │
│  │  │  Audio      │  │  Audio      │                        │ │
│  │  │  1-Back     │  │  2-Back     │                        │ │
│  │  │  In Progress│  │  🔒 Locked  │                        │ │
│  │  └─────────────┘  └─────────────┘                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─ PHASE 2: INTEGRATION ────────────────────────────────────┐ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │ │
│  │  │  Dual 1-Back│  │  Dual 2-Back│  │  Dual 2-Back+│      │ │
│  │  │  🔒 Locked  │  │  🔒 Locked  │  │  🔒 Locked  │       │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─ PHASE 3: ADVANCED ───────────────────────────────────────┐ │
│  │  ┌─────────────┐  ┌─────────────┐                        │ │
│  │  │  Dual 3-Back│  │  Adaptive   │                        │ │
│  │  │  🔒 Locked  │  │  🔒 Locked  │                        │ │
│  │  └─────────────┘  └─────────────┘                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Components Needed**:
- `PhaseSection` - Container for each training phase
- `LevelCard` - Individual level selection card
- `LockIndicator` - Shows what's needed to unlock
- `CompletionBadge` - Shows completion status

**Key Features**:
- Group levels by phase
- Show locked/unlocked status
- Display completion indicators
- Show unlock requirements on hover

---

## 3. Pre-Session Briefing Screen

### File: `src/app/train/[levelId]/page.tsx`

**Purpose**: Prepare user before each training session

**Layout Wireframe**:
```
┌────────────────────────────────────────────────────────────────┐
│                    SESSION BRIEFING                            │
│                                                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  You're about to train:  DUAL 2-BACK                      │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ 📍 POSITION: Match grid location from 2 steps ago   │  │ │
│  │  │    Press [A] or tap left button                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ 🔊 AUDIO: Match letter sound from 2 steps ago       │  │ │
│  │  │    Press [L] or tap right button                    │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ⏱️ Trial duration: 3 seconds                             │ │
│  │  📊 Session length: 25 trials (~2 min)                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─ QUICK EXAMPLE ───────────────────────────────────────────┐ │
│  │  Trial 1: [Top-Left] "K"                                  │ │
│  │  Trial 2: [Center] "R"                                    │ │
│  │  Trial 3: [Top-Left] "S"  ← POSITION MATCH!               │ │
│  │  Trial 4: [Bottom] "R"    ← AUDIO MATCH!                  │ │
│  │              [▶ See Animated Demo]                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│        ┌─────────────────────────────────────┐                 │
│        │     ▶  BEGIN SESSION                │                 │
│        └─────────────────────────────────────┘                 │
│               [Skip briefings in future]                       │
└────────────────────────────────────────────────────────────────┘
```

**Components Needed**:
- `BriefingHeader` - Level name and description
- `ControlInstructions` - Position and audio control explanations
- `SessionInfo` - Duration and trial count
- `ExampleSequence` - Visual example of matches
- `AnimatedDemo` - Optional animated tutorial
- `HelpfulHints` - Tips for success

**Key Features**:
- Show controls based on training mode
- Display estimated session duration
- Animated example sequence
- Option to skip in future

---

## 4. Active Training Interface

### File: `src/app/train/[levelId]/session/page.tsx`

**Purpose**: The main training experience

**Layout Wireframe**:
```
┌────────────────────────────────────────────────────────────────┐
│   DUAL 2-BACK                              Trial 12/25  [||]   │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                │
│                          [?] ◄── Quick help                    │
│                                                                │
│                    ┌───────┬───────┬───────┐                   │
│                    │       │       │       │                   │
│                    │       │   ●   │       │   ◄── Active cell │
│                    │       │       │       │                   │
│                    ├───────┼───────┼───────┤                   │
│                    │       │       │       │                   │
│                    │       │       │       │                   │
│                    │       │       │       │                   │
│                    ├───────┼───────┼───────┤                   │
│                    │       │       │       │                   │
│                    │       │       │       │                   │
│                    │       │       │       │                   │
│                    └───────┴───────┴───────┘                   │
│                                                                │
│                         🔊 "K"                                 │
│                                                                │
│                    ╭─────────────────────╮                     │
│                    │  ○ ○  History: C K  │ ◄── Optional helper │
│                    ╰─────────────────────╯                     │
│                                                                │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │   📍 POSITION        │    │   🔊 AUDIO           │        │
│   │      MATCH           │    │      MATCH           │        │
│   │      [ A ]           │    │      [ L ]           │        │
│   └──────────────────────┘    └──────────────────────┘        │
│                                                                │
│   ┌────────────────────────────────────────────────────────┐   │
│   │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  48%   │   │
│   └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Components Needed**:

### Grid Component
```typescript
// src/components/training/Grid.tsx
interface GridProps {
  activePosition: number | null;
  onCellClick?: (position: number) => void;
}
```

### Response Buttons
```typescript
// src/components/training/ResponseButtons.tsx
interface ResponseButtonsProps {
  mode: TrainingMode;
  onPositionMatch: () => void;
  onAudioMatch: () => void;
  positionFeedback?: 'correct' | 'incorrect' | null;
  audioFeedback?: 'correct' | 'incorrect' | null;
}
```

### History Helper
```typescript
// src/components/training/HistoryHelper.tsx
interface HistoryHelperProps {
  positions: number[];
  letters: string[];
  nBack: number;
  show: boolean;
}
```

### Session Header
```typescript
// src/components/training/SessionHeader.tsx
interface SessionHeaderProps {
  levelName: string;
  currentTrial: number;
  totalTrials: number;
  onPause: () => void;
}
```

**Key Features**:
- Smooth cell activation animations
- Audio playback synchronized with visual
- Keyboard shortcuts (A, L, Space, Escape)
- Optional history helper for beginners
- Pause/resume functionality
- Progress indication
- Quick help popover

**Cell States**:
```
Inactive:    bg-surface-subtle, border-border-subtle
Active:      bg-accent-cyan-glow, glow effect, scale animation
Correct:     bg-success-subtle, brief flash
Incorrect:   bg-error-subtle, shake animation
```

---

## 5. Post-Session Results Page

### File: `src/app/results/[sessionId]/page.tsx`

**Purpose**: Display performance after training session

**Layout Wireframe**:
```
┌────────────────────────────────────────────────────────────────┐
│                      SESSION COMPLETE                          │
│                                                                │
│                    ╭──────────────────╮                        │
│                    │       78%        │                        │
│                    │   Combined       │                        │
│                    │   Accuracy       │                        │
│                    ╰──────────────────╯                        │
│                                                                │
│        ┌─────────────────┬─────────────────┐                   │
│        │   📍 Position   │   🔊 Audio      │                   │
│        │      82%        │      74%        │                   │
│        └─────────────────┴─────────────────┘                   │
│                                                                │
│   ┌────────────────────────────────────────────────────────┐   │
│   │  DETAILED BREAKDOWN                                    │   │
│   │                                                        │   │
│   │  Position                    Audio                     │   │
│   │  ──────────                  ──────────                │   │
│   │  Hits: 9/11 (82%)           Hits: 7/10 (70%)          │   │
│   │  False Alarms: 2            False Alarms: 3            │   │
│   │  D-Prime: 2.4               D-Prime: 1.9               │   │
│   │                                                        │   │
│   │  Response Time: 1.2s avg                               │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                │
│   ┌────────────────────────────────────────────────────────┐   │
│   │  💬 COACH'S NOTES                                      │   │
│   │  "Solid session! Your position memory is strong..."    │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                │
│        [Train Again]    [Review Mistakes]    [Done]            │
└────────────────────────────────────────────────────────────────┘
```

**Components Needed**:
- `ScoreCircle` - Large accuracy display
- `StatComparison` - Position vs Audio stats
- `DetailedBreakdown` - Hits, misses, false alarms, d-prime
- `CoachNotes` - AI-generated feedback based on performance
- `ActionButtons` - Train again, review, done

**Coach Notes Logic**:
```typescript
function generateCoachNotes(result: SessionResult): string {
  const notes: string[] = [];

  // Accuracy feedback
  if (result.combinedAccuracy >= 0.85) {
    notes.push("Excellent session! You're mastering this level.");
  } else if (result.combinedAccuracy >= 0.70) {
    notes.push("Solid session! You're making good progress.");
  } else {
    notes.push("Keep practicing! Every session builds neural pathways.");
  }

  // Position vs Audio comparison
  const posDiff = result.positionStats.accuracy - result.audioStats.accuracy;
  if (Math.abs(posDiff) > 0.15) {
    if (posDiff > 0) {
      notes.push("Your position memory is stronger than audio. Try focusing more on the letter sounds.");
    } else {
      notes.push("Your audio memory is stronger. Try using peripheral vision more for position tracking.");
    }
  }

  // False alarm feedback
  if (result.positionStats.falseAlarmRate > 0.3 || result.audioStats.falseAlarmRate > 0.3) {
    notes.push("You had some false alarms—try pausing slightly before pressing to confirm the match.");
  }

  return notes.join(" ");
}
```

---

## 6. Settings Page

### File: `src/app/settings/page.tsx`

**Components Needed**:
- `SettingRow` - Label, control, help popover
- `Slider` - For volume, trial duration
- `Toggle` - For boolean settings
- `Select` - For session length

**Settings to Include**:
- Trial Duration (2.0s - 4.0s)
- Session Length (15, 20, 25, 30 trials)
- Adaptive Mode (on/off)
- Show History Helper (on/off)
- Show Briefing (on/off)
- Sound Enabled (on/off)
- Volume (0-100%)

---

## 7. Progress Page

### File: `src/app/progress/page.tsx`

**Components Needed**:
- `StreakDisplay` - Current and longest streak
- `AccuracyChart` - Line chart of accuracy over time
- `SessionHistory` - List of recent sessions
- `LevelProgress` - Completion status per level
- `StatsSummary` - Total sessions, total time, average accuracy

---

## Training Components Detail

### Grid Component Implementation

```typescript
// src/components/training/Grid.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GridProps {
  activePosition: number | null;
  feedback?: { position: number; type: 'correct' | 'incorrect' } | null;
}

const GRID_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function Grid({ activePosition, feedback }: GridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-72 h-72 md:w-80 md:h-80">
      {GRID_POSITIONS.map((position) => (
        <GridCell
          key={position}
          position={position}
          isActive={activePosition === position}
          feedback={feedback?.position === position ? feedback.type : null}
        />
      ))}
    </div>
  );
}

interface GridCellProps {
  position: number;
  isActive: boolean;
  feedback: 'correct' | 'incorrect' | null;
}

function GridCell({ position, isActive, feedback }: GridCellProps) {
  return (
    <motion.div
      className={cn(
        'rounded-xl border-2 transition-colors relative',
        'flex items-center justify-center',
        {
          'bg-surface-subtle border-border-subtle': !isActive && !feedback,
          'bg-accent-cyan-glow border-accent-cyan shadow-glow-cyan': isActive,
          'bg-success-subtle border-success': feedback === 'correct',
          'bg-error-subtle border-error': feedback === 'incorrect',
        }
      )}
      animate={
        isActive
          ? {
              scale: [1, 1.02, 1],
              transition: { duration: 0.3 },
            }
          : feedback === 'incorrect'
          ? {
              x: [0, -4, 4, -4, 4, 0],
              transition: { duration: 0.3 },
            }
          : {}
      }
    >
      {isActive && (
        <motion.div
          className="w-8 h-8 rounded-full bg-accent-cyan"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        />
      )}
    </motion.div>
  );
}
```

### Response Buttons Implementation

```typescript
// src/components/training/ResponseButtons.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { TrainingMode } from '@/types';

interface ResponseButtonsProps {
  mode: TrainingMode;
  onPositionMatch: () => void;
  onAudioMatch: () => void;
  disabled?: boolean;
}

export function ResponseButtons({
  mode,
  onPositionMatch,
  onAudioMatch,
  disabled = false,
}: ResponseButtonsProps) {
  const showPosition = mode !== 'audio-only';
  const showAudio = mode !== 'position-only';

  return (
    <div className="flex gap-4 justify-center">
      {showPosition && (
        <ResponseButton
          label="Position Match"
          shortcut="A"
          icon="📍"
          onClick={onPositionMatch}
          disabled={disabled}
        />
      )}
      {showAudio && (
        <ResponseButton
          label="Audio Match"
          shortcut="L"
          icon="🔊"
          onClick={onAudioMatch}
          disabled={disabled}
        />
      )}
    </div>
  );
}

interface ResponseButtonProps {
  label: string;
  shortcut: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
}

function ResponseButton({
  label,
  shortcut,
  icon,
  onClick,
  disabled,
}: ResponseButtonProps) {
  return (
    <motion.button
      className={cn(
        'flex flex-col items-center justify-center',
        'w-36 h-28 md:w-44 md:h-32',
        'rounded-2xl border-2 border-border-default',
        'bg-surface-subtle hover:bg-surface-hover',
        'transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-xs text-text-muted mt-1">[ {shortcut} ]</span>
    </motion.button>
  );
}
```

---

## Deliverables Checklist

### Pages
- [ ] Landing/Home page with journey map
- [ ] Level Selection page with phase grouping
- [ ] Pre-Session Briefing page
- [ ] Active Training session page
- [ ] Post-Session Results page
- [ ] Settings page
- [ ] Progress/Statistics page

### Training Components
- [ ] Grid component with cell states
- [ ] Response buttons (position/audio)
- [ ] History helper overlay
- [ ] Session header with progress
- [ ] Countdown overlay
- [ ] Pause overlay

### Results Components
- [ ] Score circle/card
- [ ] Detailed breakdown table
- [ ] Coach notes generator
- [ ] Action buttons

### Progress Components
- [ ] Streak counter
- [ ] Journey map
- [ ] Session history list
- [ ] Statistics charts

---

## Success Criteria

1. All pages render without errors
2. Navigation between pages works correctly
3. Training session plays through completely
4. Results display accurate statistics
5. Settings persist and apply correctly
6. Progress is tracked across sessions
7. Responsive design works on mobile and desktop
8. Keyboard shortcuts function during training

---

## Dependencies for Next Phase

Phase 5 (Help System) requires:
- All pages built and functional
- Popover trigger points identified
- Component refs for tutorial targeting

---

## Notes

- Start with desktop layout, then adapt for mobile
- Test training flow end-to-end frequently
- Ensure session state survives page navigation
- Consider loading states for async operations
- Add error boundaries for resilience
