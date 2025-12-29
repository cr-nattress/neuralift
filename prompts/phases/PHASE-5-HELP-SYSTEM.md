# Phase 5: Help System & Contextual Content

## Overview

Implement the extensive contextual help system with intelligent popovers that guide users through every aspect of the training. This phase creates the "why" behind every feature.

---

## Objectives

1. Build the core Popover component system
2. Create the complete popover content library
3. Implement first-time user guided tour
4. Add contextual help triggers throughout the app
5. Build the "Learn More" modal with educational content

---

## Popover Design Principles

Every popover must answer three questions:
1. **WHAT** — What is this element/action?
2. **WHY** — Why does this matter for training?
3. **HOW** — How do I use it effectively?

---

## Popover Visual Design

```
┌─────────────────────────────────────────────────┐
│  ┌─ Icon ─┐                           [×]       │
│  │   🧠   │  Position Matching                  │
│  └────────┘                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Track where the square appears on the grid.   │
│  When it matches the position from N steps     │
│  ago, that's a position match!                 │
│                                                 │
│  ┌─ WHY THIS MATTERS ─────────────────────────┐│
│  │ Position tracking activates your spatial   ││
│  │ working memory in the parietal cortex.     ││
│  │ This is crucial for navigation, math, and  ││
│  │ visual reasoning.                          ││
│  └────────────────────────────────────────────┘│
│                                                 │
│  💡 Pro tip: Don't try to memorize—let your   │
│     brain develop an intuitive feel for it.    │
│                                                 │
│  ─────────────────────────────────────────────  │
│  [Watch 30s Tutorial]        [Got it →]        │
└─────────────────────────────────────────────────┘
```

---

## Core Popover Component

### File: `src/components/ui/Popover.tsx`

```typescript
'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Play } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { PopoverContent } from '@/types';

interface HelpPopoverProps {
  children: React.ReactNode;
  content: PopoverContent;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  showOnMount?: boolean;
  className?: string;
}

export function HelpPopover({
  children,
  content,
  side = 'top',
  align = 'center',
  showOnMount = false,
  className,
}: HelpPopoverProps) {
  const [open, setOpen] = useState(showOnMount);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        {children}
      </PopoverPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              side={side}
              align={align}
              sideOffset={8}
              asChild
              onEscapeKeyDown={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={cn(
                  'z-50 w-[360px] max-w-[90vw]',
                  'rounded-2xl border border-border-subtle',
                  'bg-gradient-to-br from-bg-elevated/95 to-bg-secondary/98',
                  'backdrop-blur-xl',
                  'shadow-xl shadow-black/30',
                  'p-5',
                  className
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {content.icon && (
                      <span className="text-2xl">{content.icon}</span>
                    )}
                    <h3 className="font-display font-bold text-lg text-text-primary">
                      {content.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} className="text-text-tertiary" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-4">
                  {content.description}
                </p>

                {/* Why It Matters Box */}
                {content.whyItMatters && (
                  <div className="bg-surface-subtle border-l-3 border-accent-cyan rounded-r-lg p-4 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-cyan mb-2 block">
                      Why This Matters
                    </span>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {content.whyItMatters}
                    </p>
                  </div>
                )}

                {/* Pro Tip */}
                {content.proTip && (
                  <div className="flex gap-2 text-sm mb-4">
                    <span className="text-accent-gold">💡</span>
                    <p className="text-text-secondary italic">
                      {content.proTip}
                    </p>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                  {content.videoUrl ? (
                    <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                      <Play size={14} />
                      Watch Tutorial
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-accent-cyan text-bg-primary font-medium text-sm hover:bg-accent-cyan-muted transition-colors"
                  >
                    Got it
                  </button>
                </div>

                {/* Arrow */}
                <PopoverPrimitive.Arrow
                  className="fill-bg-elevated"
                  width={12}
                  height={6}
                />
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}
```

### Help Trigger Component

```typescript
// src/components/help/HelpTrigger.tsx
'use client';

import { HelpCircle } from 'lucide-react';
import { HelpPopover } from '@/components/ui/Popover';
import { popoverContent } from '@/content/popoverContent';
import { cn } from '@/lib/utils';

interface HelpTriggerProps {
  contentKey: keyof typeof popoverContent;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTrigger({
  contentKey,
  className,
  size = 'md',
  side = 'top',
}: HelpTriggerProps) {
  const content = popoverContent[contentKey];

  if (!content) {
    console.warn(`Popover content not found for key: ${contentKey}`);
    return null;
  }

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <HelpPopover content={content} side={side}>
      <button
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-full p-1',
          'text-text-tertiary hover:text-text-secondary',
          'hover:bg-surface-subtle',
          'transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-bg-primary',
          className
        )}
        aria-label={`Learn more about ${content.title}`}
      >
        <HelpCircle size={iconSizes[size]} />
      </button>
    </HelpPopover>
  );
}
```

---

## Complete Popover Content Library

### File: `src/content/popoverContent.ts`

```typescript
import type { PopoverContent } from '@/types';

export const popoverContent: Record<string, PopoverContent> = {
  // ==========================================
  // TRAINING LEVEL POPOVERS
  // ==========================================

  'level-position-1back': {
    icon: '🎯',
    title: 'Position Training: 1-Back',
    description:
      'Watch where the square lights up. Press the button when the current position is the SAME as where it was ONE step ago.',
    whyItMatters:
      'This builds your foundational spatial memory. Your brain\'s parietal cortex is learning to hold and compare locations—a skill used in everything from parallel parking to reading maps.',
    proTip:
      "Don't overthink it. Your brain works better when you relax and let pattern recognition happen naturally. Trust your instincts!",
    videoUrl: '/tutorials/position-1back.mp4',
  },

  'level-position-2back': {
    icon: '🎯',
    title: 'Position Training: 2-Back',
    description:
      "Now you're matching positions from TWO steps ago. This means holding two positions in mind while a third appears.",
    whyItMatters:
      "Jumping to 2-back dramatically increases cognitive load. You're training your brain to maintain multiple items in working memory simultaneously—essential for complex problem-solving.",
    proTip:
      "Imagine the positions as a 'sliding window' of two slots. Each new position pushes out the oldest one. Some people find it helps to subvocalize positions (e.g., 'top-left, center').",
    videoUrl: '/tutorials/position-2back.mp4',
  },

  'level-audio-1back': {
    icon: '🔊',
    title: 'Audio Training: 1-Back',
    description:
      'Listen to the letters being spoken. Press the button when you hear the SAME letter as the one immediately before.',
    whyItMatters:
      "Audio processing uses different brain regions than visual. By training both separately first, you build independent 'muscles' before combining them. This activates your phonological loop—the part of working memory that handles verbal information.",
    proTip:
      "Close your eyes if it helps you focus. Let the letters flow without trying to 'see' them in your mind.",
    videoUrl: '/tutorials/audio-1back.mp4',
  },

  'level-audio-2back': {
    icon: '🔊',
    title: 'Audio Training: 2-Back',
    description:
      "Match letters from TWO steps back. You'll hear a new letter while holding the previous two in memory.",
    whyItMatters:
      'Your phonological loop is now juggling multiple items. This directly trains the verbal working memory you use when following complex instructions, learning new vocabulary, or mental math.',
    proTip:
      "Some people silently 'rehearse' the last two letters in a rhythm. Find what works for you—there's no single right technique.",
    videoUrl: '/tutorials/audio-2back.mp4',
  },

  'level-dual-1back': {
    icon: '🧠',
    title: 'Dual Training Begins!',
    description:
      "Now both position AND audio happen together. You have two separate buttons—one for position matches, one for audio matches. They're independent: you might get a position match, an audio match, both, or neither on any given trial.",
    whyItMatters:
      "THIS is the magic of dual n-back. By forcing your brain to track two streams simultaneously, you're training the central executive—the 'conductor' of your working memory that coordinates multiple processes. Research suggests this type of training may transfer to fluid intelligence.",
    proTip:
      "Start slow. It's normal to feel overwhelmed. Your brain is literally building new neural pathways. Give yourself permission to make mistakes—that's where the growth happens.",
    videoUrl: '/tutorials/dual-intro.mp4',
  },

  'level-dual-2back': {
    icon: '🧠',
    title: 'Dual 2-Back: The Classic',
    description:
      'The standard dual n-back task used in cognitive research. Track both position and audio, each requiring 2-back matching.',
    whyItMatters:
      "You've reached the level most commonly used in scientific studies on working memory training. Maintaining two independent 2-back streams creates substantial cognitive load—exactly what's needed for neuroplasticity.",
    proTip:
      "Sessions should feel challenging but not impossible. If you're getting 80%+, you're ready for 3-back. Below 50%? No shame in dropping back to build more foundation.",
    videoUrl: '/tutorials/dual-2back.mp4',
  },

  'level-dual-3back': {
    icon: '⚡',
    title: 'Advanced: Dual 3-Back',
    description:
      "Elite territory. You're now holding THREE positions and THREE letters while processing new stimuli. Very few people train at this level.",
    whyItMatters:
      "You're pushing the theoretical limits of working memory capacity (typically 4±1 items). This extreme load forces maximum neural adaptation. Even attempting 3-back, regardless of accuracy, provides significant training benefit.",
    proTip:
      "Accuracy will drop significantly—that's expected. Focus on staying relaxed and maintaining your rhythm. Your brain will gradually adapt to this new demand.",
    videoUrl: '/tutorials/dual-3back.mp4',
  },

  // ==========================================
  // UI ELEMENT POPOVERS
  // ==========================================

  grid: {
    icon: '⊞',
    title: 'The Memory Grid',
    description:
      'This 3×3 grid shows position stimuli. One cell lights up each trial, and you track its location across time.',
    whyItMatters:
      'The grid layout activates spatial memory circuits. Nine positions provides enough variety to prevent simple pattern memorization while remaining visually trackable.',
    proTip:
      "Let your peripheral vision help. You don't need to 'stare' at the grid—a soft focus often works better than intense concentration.",
  },

  'position-button': {
    icon: '📍',
    title: 'Position Match Button',
    description:
      "Press this (or keyboard 'A') when the current grid position matches where the square was N steps ago.",
    whyItMatters:
      'Quick, confident responses indicate strong spatial memory encoding. Hesitation often means you\'re reconstructing rather than recognizing—both are valid, but recognition is the goal.',
    proTip:
      'If you\'re unsure, make your best guess and move on. Dwelling disrupts your rhythm and makes the next trial harder.',
  },

  'audio-button': {
    icon: '🔊',
    title: 'Audio Match Button',
    description:
      "Press this (or keyboard 'L') when you hear the same letter that played N steps ago.",
    whyItMatters:
      'Separating the audio response from position helps your brain maintain independent processing streams—exactly the skill dual n-back develops.',
    proTip:
      'Position your fingers on both keys (A and L) before starting. Physical readiness supports mental readiness.',
  },

  'history-helper': {
    icon: '📜',
    title: 'History Helper (Training Wheels)',
    description:
      "Shows the last N positions/letters to help you learn. This will fade out as you improve—the goal is to internalize this tracking.",
    whyItMatters:
      'Explicit memory aids help during learning but can become a crutch. We gradually remove them so your working memory does the heavy lifting, which is where the real training happens.',
    proTip:
      'Try to answer BEFORE checking the helper. Use it to verify, not to decide. This builds the neural pathways faster.',
  },

  'progress-bar': {
    icon: '📊',
    title: 'Session Progress',
    description:
      'Shows how many trials remain in your session. A standard session is 20-25 trials, taking about 2-3 minutes.',
    whyItMatters:
      "Knowing where you are in a session helps pace your mental energy. It's normal for accuracy to dip mid-session as fatigue sets in, then sometimes recover as you find your rhythm.",
    proTip:
      'If you\'re consistently fading at the end, try shorter sessions. Quality trumps quantity in cognitive training.',
  },

  'accuracy-display': {
    icon: '🎯',
    title: 'Live Accuracy',
    description:
      'Your current session accuracy, calculated from hits, misses, and false alarms.',
    whyItMatters:
      "Tracking accuracy helps you understand your performance, but don't obsess over it during a session. Checking constantly can disrupt your flow state.",
    proTip:
      "Aim for 70-85% accuracy. Higher means the level is too easy; lower means it's too hard. The sweet spot is where you're challenged but not overwhelmed.",
  },

  // ==========================================
  // SETTINGS POPOVERS
  // ==========================================

  'setting-trial-duration': {
    icon: '⏱️',
    title: 'Trial Duration',
    description:
      'How long each stimulus displays. Longer = easier. Shorter = more challenging.',
    whyItMatters:
      'Faster trials increase cognitive load exponentially. Your brain has less time to encode, maintain, and compare. Start slower, then reduce as you improve.',
    proTip:
      '3 seconds is standard. Go to 2.5s or 2s only after consistent 80%+ accuracy. Going too fast too soon leads to frustration, not progress.',
  },

  'setting-session-length': {
    icon: '📏',
    title: 'Session Length',
    description:
      'Number of trials per session. More trials = more data points but also more fatigue.',
    whyItMatters:
      'Cognitive training benefits come from sustained effort, but mental fatigue degrades performance. 20-25 trials hits the sweet spot for most people.',
    proTip:
      'Multiple short sessions beat one long session. Three 20-trial sessions across the day outperforms one 60-trial marathon.',
  },

  'setting-adaptive-mode': {
    icon: '🔄',
    title: 'Adaptive Difficulty',
    description:
      'The N level automatically adjusts based on your performance. High accuracy → harder. Low accuracy → easier.',
    whyItMatters:
      "Staying in your 'zone of proximal development' maximizes training efficiency. Adaptive mode keeps you challenged without letting you plateau or get discouraged.",
    proTip:
      "Best for maintenance training after you've mastered the basics. For building new skills, fixed levels let you focus on specific challenges.",
  },

  // ==========================================
  // RESULTS POPOVERS
  // ==========================================

  'result-hit-rate': {
    icon: '✓',
    title: 'Hit Rate',
    description:
      'Percentage of actual matches you correctly identified. Hits ÷ Total Matches.',
    whyItMatters:
      'High hit rate means your memory encoding is strong—you\'re successfully storing and retrieving the N-back information.',
    proTip:
      'If hit rate is low but false alarm rate is also low, you\'re being too conservative. Trust your hunches more.',
  },

  'result-false-alarm': {
    icon: '✗',
    title: 'False Alarm Rate',
    description:
      'Percentage of non-matches where you incorrectly pressed. False Alarms ÷ Total Non-Matches.',
    whyItMatters:
      "High false alarms suggest you're either guessing too much or experiencing 'memory intrusions' where old stimuli feel current.",
    proTip:
      'If false alarms are high, slow down your response. Take a breath between trials. Quality over speed.',
  },

  'result-dprime': {
    icon: '📐',
    title: "D-Prime (d') Score",
    description:
      'A scientific measure of your ability to distinguish matches from non-matches, accounting for response bias.',
    whyItMatters:
      "D-prime is used in research because it separates true memory ability from guessing strategies. Higher d' = better discrimination.",
    proTip:
      "D-prime above 2.0 is good, above 3.0 is excellent. Unlike accuracy, d-prime isn't inflated by conservative or liberal response styles.",
  },

  // ==========================================
  // JOURNEY & PROGRESS POPOVERS
  // ==========================================

  'journey-phase-1': {
    icon: '🏗️',
    title: 'Phase 1: Foundations',
    description:
      'Build your spatial and auditory working memory separately before combining them.',
    whyItMatters:
      'Training each modality independently ensures you have solid foundations. Like learning to walk before running, this prevents developing compensatory strategies.',
    proTip:
      "Don't rush to dual training. Mastering single-modality tasks (70%+ accuracy) makes dual training much more effective.",
  },

  'journey-phase-2': {
    icon: '🔗',
    title: 'Phase 2: Integration',
    description:
      'Combine position and audio tracking into true dual n-back training.',
    whyItMatters:
      'The integration phase is where the real cognitive benefits emerge. Your brain\'s central executive learns to coordinate multiple information streams—a skill that transfers to real-world multitasking.',
    proTip:
      'Expect your accuracy to drop when first combining modalities. This is normal and temporary.',
  },

  'journey-phase-3': {
    icon: '🚀',
    title: 'Phase 3: Advanced',
    description:
      'Push beyond standard 2-back to elite 3-back and adaptive training.',
    whyItMatters:
      'Advanced training provides continued challenge once 2-back becomes comfortable. Maintaining a challenging level is crucial for ongoing cognitive benefits.',
    proTip:
      'Advanced training is about maintaining challenge, not achieving perfection. Even 50% accuracy at 3-back provides strong training stimulus.',
  },

  streak: {
    icon: '🔥',
    title: 'Training Streak',
    description:
      'Consecutive days with at least one training session. Streaks help build lasting habits.',
    whyItMatters:
      'Consistency matters more than intensity for cognitive training. Daily practice, even brief, is more effective than occasional long sessions.',
    proTip:
      'Aim for at least one session per day. Even a quick 15-trial session maintains your streak and keeps neural pathways active.',
  },
};
```

---

## Guided Tour System

### File: `src/components/help/GuidedTour.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { popoverContent } from '@/content/popoverContent';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TourStep {
  target: string; // CSS selector
  contentKey: keyof typeof popoverContent;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="grid"]',
    contentKey: 'grid',
    placement: 'bottom',
  },
  {
    target: '[data-tour="position-button"]',
    contentKey: 'position-button',
    placement: 'top',
  },
  {
    target: '[data-tour="audio-button"]',
    contentKey: 'audio-button',
    placement: 'top',
  },
  {
    target: '[data-tour="progress-bar"]',
    contentKey: 'progress-bar',
    placement: 'bottom',
  },
];

export function GuidedTour() {
  const [tourComplete, setTourComplete] = useLocalStorage('tourComplete', false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (tourComplete) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target);
    if (element) {
      setTargetRect(element.getBoundingClientRect());
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, tourComplete]);

  if (tourComplete) return null;

  const step = TOUR_STEPS[currentStep];
  const content = step ? popoverContent[step.contentKey] : null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTourComplete(true);
    }
  };

  const handleSkip = () => {
    setTourComplete(true);
  };

  return (
    <AnimatePresence>
      {content && targetRect && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={handleSkip}
          />

          {/* Spotlight */}
          <motion.div
            className="fixed z-40 rounded-xl ring-4 ring-accent-cyan"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          />

          {/* Tour Card */}
          <motion.div
            className="fixed z-50 w-80 p-5 rounded-2xl bg-bg-elevated border border-border-subtle shadow-xl"
            style={getTourCardPosition(targetRect, step.placement)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-tertiary">
                {currentStep + 1} of {TOUR_STEPS.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-text-tertiary hover:text-text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex items-center gap-2 mb-3">
              {content.icon && <span className="text-xl">{content.icon}</span>}
              <h3 className="font-bold text-text-primary">{content.title}</h3>
            </div>

            <p className="text-sm text-text-secondary mb-4">
              {content.description}
            </p>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="text-sm text-text-tertiary hover:text-text-secondary"
              >
                Skip tour
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent-cyan text-bg-primary font-medium text-sm"
              >
                {currentStep < TOUR_STEPS.length - 1 ? 'Next' : 'Done'}
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getTourCardPosition(
  rect: DOMRect,
  placement: string
): React.CSSProperties {
  const gap = 16;

  switch (placement) {
    case 'bottom':
      return {
        top: rect.bottom + gap,
        left: rect.left + rect.width / 2 - 160,
      };
    case 'top':
      return {
        bottom: window.innerHeight - rect.top + gap,
        left: rect.left + rect.width / 2 - 160,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - 100,
        right: window.innerWidth - rect.left + gap,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2 - 100,
        left: rect.right + gap,
      };
    default:
      return { top: rect.bottom + gap, left: rect.left };
  }
}
```

---

## Quick Help (In-Session)

### File: `src/components/help/QuickHelp.tsx`

```typescript
'use client';

import { HelpCircle } from 'lucide-react';
import { HelpPopover } from '@/components/ui/Popover';

interface QuickHelpProps {
  nBack: number;
}

export function QuickHelp({ nBack }: QuickHelpProps) {
  const content = {
    title: 'Quick Reminder',
    description: `Position Match (A): Current square = square from ${nBack} ago\nAudio Match (L): Current letter = letter from ${nBack} ago`,
    proTip: "Both, one, or neither can be true. They're independent!",
  };

  return (
    <HelpPopover content={content} side="bottom">
      <button
        className="p-2 rounded-full hover:bg-surface-subtle transition-colors"
        aria-label="Quick help"
      >
        <HelpCircle size={20} className="text-text-tertiary" />
      </button>
    </HelpPopover>
  );
}
```

---

## Learn More Modal

### File: `src/components/help/LearnMoreModal.tsx`

```typescript
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Target, TrendingUp, Clock } from 'lucide-react';

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearnMoreModal({ open, onOpenChange }: LearnMoreModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl bg-bg-elevated border border-border-subtle p-8"
              >
                <Dialog.Title className="text-2xl font-display font-bold text-text-primary mb-6">
                  What is Dual N-Back Training?
                </Dialog.Title>

                <div className="space-y-6">
                  <Section
                    icon={<Brain className="text-accent-cyan" />}
                    title="The Science"
                    content="Dual n-back is a cognitive training task that challenges your working memory—the mental workspace where you hold and manipulate information. By tracking two streams of information (visual positions and audio letters) simultaneously, you train your brain's central executive function."
                  />

                  <Section
                    icon={<Target className="text-accent-magenta" />}
                    title="How It Works"
                    content="In each trial, you see a square light up on a grid while hearing a letter. Your job is to identify when the current position or letter matches what appeared N steps ago. Start with 1-back (matching the previous item) and progress to 2-back, 3-back, and beyond."
                  />

                  <Section
                    icon={<TrendingUp className="text-success" />}
                    title="Benefits"
                    content="Research suggests dual n-back training may improve working memory capacity, fluid intelligence, and cognitive control. Users report better focus, faster mental processing, and improved ability to handle complex information."
                  />

                  <Section
                    icon={<Clock className="text-accent-gold" />}
                    title="Recommended Practice"
                    content="For best results, train for 15-25 minutes daily, 4-5 days per week. Consistency matters more than session length. Progress gradually—master each level before advancing to prevent frustration."
                  />
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface-hover transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} className="text-text-tertiary" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Section({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
```

---

## Adding Help to Components

Example of adding help triggers to existing components:

```typescript
// In SessionHeader component
<div className="flex items-center gap-2">
  <span className="text-sm text-text-secondary">
    Trial {current}/{total}
  </span>
  <HelpTrigger contentKey="progress-bar" size="sm" />
</div>

// In Grid component
<div data-tour="grid" className="relative">
  <Grid ... />
  <HelpTrigger
    contentKey="grid"
    className="absolute -top-2 -right-2"
    side="left"
  />
</div>

// In ResponseButtons
<div data-tour="position-button">
  <ResponseButton label="Position" ... />
</div>
```

---

## Deliverables Checklist

- [ ] HelpPopover component with full styling
- [ ] HelpTrigger component for easy integration
- [ ] Complete popoverContent.ts with all content
- [ ] GuidedTour component for first-time users
- [ ] QuickHelp component for in-session help
- [ ] LearnMoreModal for educational content
- [ ] Help triggers added to all UI elements
- [ ] Tour targeting data attributes added
- [ ] Local storage for tour completion status

---

## Success Criteria

1. All popovers render with correct styling
2. Popovers are accessible via keyboard
3. Guided tour runs for first-time users
4. Tour can be skipped and doesn't show again
5. Help triggers don't obstruct UI
6. Content is accurate and helpful
7. Animations are smooth and not distracting

---

## Dependencies for Next Phase

Phase 6 (Polish) requires:
- Help system functional
- All content written
- Tour system working

---

## Notes

- Test popover positioning at all screen sizes
- Ensure popovers don't block critical UI during training
- Consider adding video tutorials later (placeholder URLs for now)
- Content should be concise but informative
- Pro tips should be genuinely helpful, not filler
