'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  TrainingGrid,
  ResponseButtons,
  SessionHeader,
  CountdownOverlay,
  PauseOverlay,
} from '@/components/training';
import { getLevelById } from '@neuralift/core';
import { useLiveRegion } from '@/components/a11y';

interface TrainingSessionPageProps {
  params: Promise<{ levelId: string }>;
}

type SessionStatus = 'initializing' | 'countdown' | 'active' | 'paused' | 'completed';

export default function TrainingSessionPage({ params }: TrainingSessionPageProps) {
  const { levelId } = use(params);
  const router = useRouter();
  const level = getLevelById(levelId);
  const { announce } = useLiveRegion();

  // Session state
  const [status, setStatus] = useState<SessionStatus>('initializing');
  const [countdownValue, setCountdownValue] = useState(3);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [activePosition, setActivePosition] = useState<number | null>(null);
  const [positionPressed, setPositionPressed] = useState(false);
  const [audioPressed, setAudioPressed] = useState(false);

  const totalTrials = 20;

  // Start countdown when component mounts
  useEffect(() => {
    if (!level) return;

    const timer = setTimeout(() => {
      setStatus('countdown');
    }, 500);

    return () => clearTimeout(timer);
  }, [level]);

  // Countdown logic
  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdownValue > 0) {
      // Announce countdown
      announce(String(countdownValue), 'assertive');
      const timer = setTimeout(() => {
        setCountdownValue((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Announce start
      announce('Go! Session started.', 'assertive');
      // Start the session after showing "GO!"
      const timer = setTimeout(() => {
        setStatus('active');
        setCurrentTrial(1);
        // Show first position
        setActivePosition(Math.floor(Math.random() * 9));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, countdownValue, announce]);

  // Trial progression (simplified demo logic)
  useEffect(() => {
    if (status !== 'active') return;

    // Announce milestone trials (every 5)
    if (currentTrial > 0 && currentTrial % 5 === 0 && currentTrial < totalTrials) {
      announce(`Trial ${currentTrial} of ${totalTrials}`, 'polite');
    }

    // Clear position after a delay
    const hideTimer = setTimeout(() => {
      setActivePosition(null);
    }, 500);

    // Advance to next trial
    const trialTimer = setTimeout(() => {
      if (currentTrial >= totalTrials) {
        announce('Session complete! Loading results.', 'assertive');
        setStatus('completed');
      } else {
        setCurrentTrial((prev) => prev + 1);
        setActivePosition(Math.floor(Math.random() * 9));
        setPositionPressed(false);
        setAudioPressed(false);
      }
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(trialTimer);
    };
  }, [status, currentTrial, announce]);

  // Handle completion
  useEffect(() => {
    if (status === 'completed') {
      // Navigate to results page (using demo session ID)
      const demoSessionId = `demo-${Date.now()}`;
      router.push(`/results/${demoSessionId}`);
    }
  }, [status, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'paused' && e.key === 'Escape') {
        setStatus('active');
        return;
      }

      if (status !== 'active') return;

      if (e.key === 'a' || e.key === 'A') {
        handlePositionMatch();
      } else if (e.key === 'l' || e.key === 'L') {
        handleAudioMatch();
      } else if (e.key === 'Escape') {
        setStatus('paused');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  const handlePositionMatch = useCallback(() => {
    if (status !== 'active') return;
    setPositionPressed(true);
  }, [status]);

  const handleAudioMatch = useCallback(() => {
    if (status !== 'active') return;
    setAudioPressed(true);
  }, [status]);

  const handlePause = useCallback(() => {
    setStatus('paused');
    announce('Session paused. Press Escape or click Resume to continue.', 'assertive');
  }, [announce]);

  const handleResume = useCallback(() => {
    setStatus('active');
    announce('Session resumed.', 'assertive');
  }, [announce]);

  const handleQuit = useCallback(() => {
    router.push('/levels');
  }, [router]);

  if (!level) {
    return (
      <main id="main-content" className="min-h-screen bg-gradient-neural flex items-center justify-center">
        <BackgroundOrbs />
        <p className="text-text-primary">Level not found</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-gradient-neural flex flex-col items-center justify-center p-4">
      <BackgroundOrbs />

      {/* Countdown Overlay */}
      <AnimatePresence>
        {status === 'countdown' && <CountdownOverlay count={countdownValue} />}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {status === 'paused' && (
          <PauseOverlay onResume={handleResume} onQuit={handleQuit} />
        )}
      </AnimatePresence>

      {/* Session Header */}
      <SessionHeader
        levelName={level.name}
        current={currentTrial}
        total={totalTrials}
        onPause={handlePause}
      />

      {/* N-Back Indicator */}
      <div className="mb-6 text-center">
        <span className="text-text-tertiary text-sm">
          Remember {level.nBack} step{level.nBack > 1 ? 's' : ''} back
        </span>
      </div>

      {/* Training Grid */}
      <TrainingGrid activePosition={activePosition} className="mb-8" />

      {/* Response Buttons */}
      <ResponseButtons
        mode={level.mode}
        onPositionMatch={handlePositionMatch}
        onAudioMatch={handleAudioMatch}
        disabled={status !== 'active'}
        positionPressed={positionPressed}
        audioPressed={audioPressed}
      />

      {/* Progress Bar */}
      <ProgressBar
        value={currentTrial}
        max={totalTrials}
        showLabel
        className="w-full max-w-md mt-8"
      />
    </main>
  );
}
